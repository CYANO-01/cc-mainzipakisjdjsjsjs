import React, { useState, useRef } from 'react';
import { Play, Square, Trash2, Settings, Download, Copy, Check, Database } from 'lucide-react';
import { parseCardLine, validateCardLocal, maskCardNumber, CheckResult, CardStatus } from '@/lib/cc-utils';
import { lookupBin, clearBinCache } from '@/lib/bin-api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function CheckerTool() {
  const { toast } = useToast();

  const [input, setInput]       = useState<string>('');
  const [results, setResults]   = useState<CheckResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused]   = useState(false);

  // Settings
  const [delay, setDelay]             = useState(300);
  const [showSettings, setShowSettings] = useState(false);
  const [binLookup, setBinLookup]     = useState(true); // enabled by default

  // Stats
  const liveCount    = results.filter(r => r.status === 'LIVE').length;
  const dieCount     = results.filter(r => r.status === 'DIE').length;
  const unknownCount = results.filter(r => r.status === 'UNKNOWN').length;
  const totalChecked = results.length;

  const lines       = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const totalCards  = lines.length;
  const progress    = totalCards > 0 ? Math.round((totalChecked / totalCards) * 100) : 0;

  const abortRef = useRef<AbortController | null>(null);

  const startCheck = async () => {
    if (lines.length === 0) {
      toast({ title: 'No cards', description: 'Please enter some cards to check.', variant: 'destructive' });
      return;
    }

    const resuming = isRunning && isPaused;
    if (!resuming) {
      setResults([]);
      clearBinCache();
    }

    setIsRunning(true);
    setIsPaused(false);

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    const cardsToCheck = resuming ? lines.slice(totalChecked) : lines;

    for (const line of cardsToCheck) {
      if (signal.aborted) break;

      const parsed = parseCardLine(line);

      if (!parsed) {
        const unknown: CheckResult = {
          original: line,
          number: 'INVALID FORMAT',
          month: '',
          year: '',
          cvv: '',
          network: 'Unknown',
          status: 'UNKNOWN',
          timestamp: Date.now(),
          confidence: 0,
        };
        setResults(prev => [unknown, ...prev]);
        if (delay > 0) await sleep(delay, signal);
        continue;
      }

      // Step 1 — fast local validation (8 layers, no network)
      const local = validateCardLocal(parsed);

      let finalStatus    = local.status;
      let finalConfidence = local.confidence;
      let bankName: string | undefined;
      let country: string | undefined;
      let cardType: string | undefined;
      let binExists: boolean | null = null;

      // Step 2 — BIN lookup (only if local says LIVE or UNKNOWN, not already DIE)
      if (binLookup && local.status !== 'DIE') {
        try {
          const binInfo = await lookupBin(parsed.number, signal);
          binExists = binInfo.exists;
          bankName  = binInfo.bank;
          country   = binInfo.country;
          cardType  = binInfo.cardType;

          if (!binInfo.exists) {
            // BIN not in any real issuer database → definitely dead
            finalStatus     = 'DIE';
            finalConfidence = 5;
          } else {
            // BIN confirmed real → boost confidence
            finalConfidence = Math.min(95, finalConfidence + 25);
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') break;
          // API unreachable — keep local result unchanged
          binExists = null;
        }
      }

      const result: CheckResult = {
        ...parsed,
        status: finalStatus,
        timestamp: Date.now(),
        confidence: finalConfidence,
        detail: {
          ...local.detail,
          binExists,
          bankName,
          country,
          cardType,
        },
      };

      setResults(prev => [result, ...prev]);

      if (delay > 0) await sleep(delay, signal);
    }

    if (!abortRef.current?.signal.aborted) {
      setIsRunning(false);
      setIsPaused(false);
      toast({
        title: 'Check Complete',
        description: `${liveCount + 1} LIVE · ${dieCount} DIE · ${unknownCount} UNKNOWN out of ${lines.length} cards`,
      });
    }
  };

  const stopCheck = () => {
    abortRef.current?.abort();
    setIsPaused(true);
    setIsRunning(false);
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setIsRunning(false);
    setIsPaused(false);
    setInput('');
    setResults([]);
    clearBinCache();
  };

  const copyLive = () => {
    const live = results.filter(r => r.status === 'LIVE').map(r => r.original).join('\n');
    if (!live) { toast({ title: 'No LIVE cards yet.' }); return; }
    navigator.clipboard.writeText(live);
    toast({ title: 'Copied', description: `${results.filter(r => r.status === 'LIVE').length} LIVE cards copied.` });
  };

  const downloadResults = () => {
    if (results.length === 0) return;
    const live = results.filter(r => r.status === 'LIVE');
    const die  = results.filter(r => r.status === 'DIE');
    const unk  = results.filter(r => r.status === 'UNKNOWN');
    const fmt  = (r: CheckResult) => {
      const bank = r.detail?.bankName ? ` [${r.detail.bankName}${r.detail.country ? ', ' + r.detail.country : ''}]` : '';
      const conf = r.confidence !== undefined ? ` (${r.confidence}%)` : '';
      return `${r.original} | ${r.network}${bank}${conf}`;
    };
    const sep = '-'.repeat(60);
    const lines = [
      `CC Checker Results - ${new Date().toISOString()}`,
      `LIVE: ${liveCount}  DIE: ${dieCount}  UNKNOWN: ${unknownCount}`,
      sep,
      `--- LIVE (${live.length}) ---`,
      ...live.map(fmt),
      sep,
      `--- DIE (${die.length}) ---`,
      ...die.map(fmt),
      ...(unk.length ? [sep, `--- UNKNOWN (${unk.length}) ---`, ...unk.map(fmt)] : []),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `cc-results-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" data-testid="checker-tool">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Column — Input ── */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col flex-1 min-h-[400px]">
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center">
              <span className="font-mono text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                INPUT DATA
              </span>
              <span className="text-xs font-mono bg-background px-2 py-1 rounded border border-border">
                {totalCards} Cards
              </span>
            </div>
            <textarea
              data-testid="card-input"
              className="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-foreground/90 placeholder:text-muted-foreground/40 outline-none"
              placeholder={`Paste cards here...\nFormat: NUM|MM|YYYY|CVV\n\n4532XXXXXXXXXXXXXXX|12|2025|123\n5123XXXXXXXXXXXXXXX|08|26|456`}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isRunning && !isPaused}
              spellCheck={false}
            />
          </div>

          {/* Progress bar */}
          {totalCards > 0 && totalChecked > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>{totalChecked} / {totalCards} checked</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {!isRunning || isPaused ? (
                <Button
                  data-testid="button-start"
                  onClick={startCheck}
                  className="flex-1 bg-primary text-primary-foreground font-mono font-bold hover:opacity-90 hover:shadow-[0_0_18px_rgba(0,255,163,0.25)] transition-all"
                >
                  <Play className="w-4 h-4 mr-2" fill="currentColor" />
                  {isPaused ? 'RESUME' : 'START'}
                </Button>
              ) : (
                <Button
                  data-testid="button-stop"
                  onClick={stopCheck}
                  variant="destructive"
                  className="flex-1 font-mono font-bold hover:shadow-[0_0_15px_rgba(255,68,68,0.3)] transition-all"
                >
                  <Square className="w-4 h-4 mr-2" fill="currentColor" />
                  STOP
                </Button>
              )}

              <Button variant="outline" onClick={clearAll} data-testid="button-clear"
                className="font-mono hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button variant="outline" onClick={() => setShowSettings(s => !s)}
                data-testid="button-settings"
                className={`font-mono ${showSettings ? 'bg-accent' : ''}`}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {showSettings && (
              <div className="pt-4 border-t border-border space-y-4 animate-in slide-in-from-top-2">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-2 flex justify-between">
                    <span>DELAY (MS)</span>
                    <span className="text-primary">{delay}ms</span>
                  </label>
                  <input type="range" min="0" max="2000" step="50" value={delay}
                    onChange={e => setDelay(parseInt(e.target.value))}
                    className="w-full accent-primary" />
                </div>

                {/* BIN Lookup toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">BIN LOOKUP</span>
                  </div>
                  <button
                    data-testid="toggle-bin-lookup"
                    onClick={() => setBinLookup(v => !v)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      binLookup ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                      binLookup ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
                {binLookup && (
                  <p className="text-xs text-muted-foreground/60 font-mono leading-relaxed">
                    Verifies BIN against real bank database via binlist.net.
                    Cards with fake BINs are marked DIE even if Luhn passes.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Algorithm legend */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-mono text-muted-foreground/60 mb-2">How checks work:</p>
            <p className="text-xs font-mono text-foreground/60 leading-relaxed">
              Luhn checksum, card length, CVV format, expiry range, pattern detection and test-card filtering
              {binLookup ? ', plus a live BIN/issuer lookup' : ''}.
            </p>
          </div>
        </div>

        {/* ── Right Column — Results ── */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard value={liveCount} label="LIVE" colorClass="live" />
            <StatCard value={dieCount}  label="DIE"  colorClass="die"  />
            <StatCard value={unknownCount} label="UNKNOWN" colorClass="unknown" />
          </div>

          {/* Export bar */}
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              {isRunning && (
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                </span>
              )}
              {isRunning ? 'CHECKING...' : results.length > 0 ? `${totalChecked} checked` : ''}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyLive}
                className="h-7 text-xs font-mono px-2 hover:bg-live/10 hover:text-live border border-transparent hover:border-live/20">
                <Copy className="w-3 h-3 mr-1" /> COPY LIVE
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadResults}
                className="h-7 text-xs font-mono px-2 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20">
                <Download className="w-3 h-3 mr-1" /> EXPORT
              </Button>
            </div>
          </div>

          {/* Split panels */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {/* LIVE panel */}
            <div className="rounded-xl border border-live/20 bg-live/5 overflow-hidden flex flex-col min-h-[380px]">
              <div className="px-4 py-2.5 border-b border-live/20 bg-live/10 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-live">LIVE</span>
                <span className="font-mono text-xs text-live/70">{liveCount}</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {results.filter(r => r.status === 'LIVE').length === 0 ? (
                  <div className="h-full flex items-center justify-center text-live/20 font-mono text-xs p-4 text-center">
                    {results.length === 0 ? 'AWAITING INPUT...' : 'NONE'}
                  </div>
                ) : (
                  <div className="divide-y divide-live/10">
                    {results.filter(r => r.status === 'LIVE').map((res, i) => (
                      <ResultRow key={res.timestamp + i} result={res} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DIE panel */}
            <div className="rounded-xl border border-die/20 bg-die/5 overflow-hidden flex flex-col min-h-[380px]">
              <div className="px-4 py-2.5 border-b border-die/20 bg-die/10 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-die">DIE</span>
                <span className="font-mono text-xs text-die/70">{dieCount + unknownCount}</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {results.filter(r => r.status !== 'LIVE').length === 0 ? (
                  <div className="h-full flex items-center justify-center text-die/20 font-mono text-xs p-4 text-center">
                    {results.length === 0 ? 'AWAITING INPUT...' : 'NONE'}
                  </div>
                ) : (
                  <div className="divide-y divide-die/10">
                    {results.filter(r => r.status !== 'LIVE').map((res, i) => (
                      <ResultRow key={res.timestamp + i} result={res} compact />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label, colorClass }: { value: number; label: string; colorClass: string }) {
  return (
    <div className={`rounded-xl border border-${colorClass}/20 bg-${colorClass}/5 p-4 flex flex-col items-center justify-center relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-${colorClass}/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300`} />
      <span className={`text-${colorClass} text-3xl font-bold font-mono z-10`}>{value}</span>
      <span className={`text-xs font-bold tracking-widest text-${colorClass}/70 mt-1 z-10`}>{label}</span>
    </div>
  );
}

function ResultRow({ result: res, compact }: { result: CheckResult; compact?: boolean }) {
  const bank    = res.detail?.bankName;
  const country = res.detail?.country;
  const conf    = res.confidence;

  return (
    <div
      data-testid={`result-row-${res.timestamp}`}
      className="px-3 py-2 flex items-start gap-2 text-xs font-mono hover:bg-accent/20 transition-colors animate-in fade-in slide-in-from-top-1"
    >
      {/* Card info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className={`truncate ${res.status === 'DIE' ? 'text-muted-foreground/60' : 'text-foreground'}`}>
          {res.number === 'INVALID FORMAT'
            ? <span className="text-unknown/70">{res.original}</span>
            : `${maskCardNumber(res.number)}|${res.month}|${res.year}|${res.cvv}`}
        </div>

        {/* Bank / Country info from BIN */}
        {(bank || country) && (
          <div className="text-xs text-muted-foreground/50 flex items-center gap-1">
            {bank && <span>{bank}</span>}
            {bank && country && <span>·</span>}
            {country && <span>{country}</span>}
            {res.detail?.cardType && (
              <span className="ml-1 bg-muted px-1 rounded capitalize">{res.detail.cardType}</span>
            )}
          </div>
        )}

        {/* Failure reasons (compact: only show in DIE panel) */}
        {res.status === 'DIE' && res.detail && (
          <div className="text-xs text-die/50 flex flex-wrap gap-1">
            {!res.detail.luhn         && <span>luhn_fail</span>}
            {!res.detail.expiryValid  && <span>expired</span>}
            {!res.detail.lengthValid  && <span>bad_length</span>}
            {res.detail.isTestCard    && <span>test_card</span>}
            {!res.detail.patternClean && <span>fake_pattern</span>}
            {res.detail.binExists === false && <span>bin_not_found</span>}
          </div>
        )}
      </div>

      {/* Right side: network + confidence */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {res.network !== 'Unknown' && (
          <NetworkBadge network={res.network} />
        )}
        {conf !== undefined && conf > 0 && (
          <span className={`text-xs font-mono ${
            conf >= 80 ? 'text-live/70' : conf >= 50 ? 'text-unknown/70' : 'text-die/50'
          }`}>
            {conf}%
          </span>
        )}
      </div>
    </div>
  );
}

function NetworkBadge({ network }: { network: string }) {
  const colors: Record<string, string> = {
    Visa:       'text-blue-400 border-blue-400/30 bg-blue-400/10',
    Mastercard: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    Amex:       'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    Discover:   'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    UnionPay:   'text-red-400 border-red-400/30 bg-red-400/10',
    JCB:        'text-purple-400 border-purple-400/30 bg-purple-400/10',
    Diners:     'text-pink-400 border-pink-400/30 bg-pink-400/10',
  };
  const cls = colors[network] || 'text-muted-foreground border-border bg-muted/30';
  return (
    <span className={`text-xs font-mono border px-1.5 py-0.5 rounded ${cls}`}>
      {network}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('AbortError', 'AbortError')); return; }
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('AbortError', 'AbortError')); });
  });
}
