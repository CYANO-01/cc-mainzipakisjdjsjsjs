import { SEOHead } from "@/components/seo-head";
import { CheckerTool } from "@/components/checker-tool";
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Lock, Globe } from "lucide-react";
import { Link } from "wouter";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CC Checker – Free Live Credit Card Checker",
  "url": "https://ccvalidator.pro/",
  "description": "Free online credit card checker and CVV validator. Uses the Luhn algorithm to validate CC numbers, BIN/IIN issuer lookup, and expiry date check. 100% client-side.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web Browser",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": [
    "Luhn algorithm credit card number validation",
    "CVV format validation",
    "BIN/IIN issuer lookup",
    "Bulk credit card checking",
    "Visa, Mastercard, Amex, Discover network detection",
    "Expiry date validation",
    "100% client-side – no data stored"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is this CC checker free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, 100% free with no limits. It runs entirely in your browser — no account required."
      }
    },
    {
      "@type": "Question",
      "name": "Does this credit card checker store my data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. This is a pure client-side tool. Your card data never leaves your browser. No server receives or stores any card numbers."
      }
    },
    {
      "@type": "Question",
      "name": "What does 'Live' and 'Die' mean in a CC checker?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "'Live' means the card passes the Luhn algorithm checksum AND has a valid future expiry date. 'Die' means it fails the Luhn check or has an expired date. Neither status involves any real bank transaction."
      }
    }
  ]
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <SEOHead
        title="CC Checker – Free Live Credit Card Checker & CVV Validator Online"
        description="Free CC checker to validate credit card numbers with CVV, check BIN issuer & live/dead status via Luhn algorithm. Bulk checker for Visa, Mastercard, Amex. 100% browser-side – no data stored."
        canonicalUrl="https://ccvalidator.pro/"
        jsonLd={[webAppSchema, faqSchema]}
      />

      {/* Hero / Tool Section */}
      <section className="pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-mono px-3 py-1 rounded-full mb-6">
            <Zap className="w-3 h-3" /> 100% Browser-Side · No Data Stored
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Free <span className="text-primary">CC Checker</span>
            <br />Live Credit Card Validator Online
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Validate credit card numbers with CVV, check BIN issuer, and detect live/dead status instantly using the Luhn algorithm. Bulk <strong className="text-foreground">checker CC live</strong> — no data ever leaves your device.
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No server calls" },
              { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "No data stored" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant results" },
              { icon: <Globe className="w-3.5 h-3.5" />, label: "7 networks supported" },
            ].map(b => (
              <span key={b.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/50 px-3 py-1.5 rounded-full">
                <span className="text-primary">{b.icon}</span>{b.label}
              </span>
            ))}
          </div>
        </div>

        <CheckerTool />
      </section>

      {/* Feature cards */}
      <section className="py-16 bg-card/30 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-bold text-lg mb-2">Credit Card Validator with CVV</h2>
              <p className="text-sm text-muted-foreground">
                Our <strong>credit card validator with CVV</strong> checks not just the card number via Luhn, but also validates the CVV digit count against the detected network (3 digits for Visa/MC, 4 for Amex) and confirms the expiry date is in the future.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <CreditCard className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-bold text-lg mb-2">Credit Card Checker with Balance</h2>
              <p className="text-sm text-muted-foreground">
                A <strong>credit card checker with balance</strong> potential starts with structural validity. Our tool identifies whether a card can mathematically hold a balance — passing Luhn + valid BIN + unexpired date. We do not query bank systems; that requires your own banking portal.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
              <Globe className="w-8 h-8 text-primary mb-4" />
              <h2 className="font-bold text-lg mb-2">BIN Checker CC — Identify Issuer</h2>
              <p className="text-sm text-muted-foreground">
                The <strong>BIN checker CC</strong> feature reads the first 6–8 digits (Bank Identification Number) to look up the issuing bank, country, and card type (debit/credit/prepaid) in real time from a public BIN registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Sections */}
      <section className="py-24 bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

            <div>
              <h2 className="text-3xl font-bold mb-6">What is a CC Checker?</h2>
              <div className="prose-custom">
                <p>
                  A <strong>cc checker</strong> (credit card checker) is an online utility that validates credit card numbers using mathematical rules. Security researchers, payment gateway developers, and e-commerce QA teams use our <strong>live cc checker</strong> to verify whether a card number is structurally valid before using it in test environments.
                </p>
                <p>
                  Our <strong>credit card checker</strong> processes every card through the <strong>Luhn algorithm</strong> (modulus 10) — the standard checksum formula used by Visa, Mastercard, Amex, and all major networks. A card that passes is marked <span className="text-green-400 font-mono font-bold">LIVE</span>; one that fails is marked <span className="text-red-400 font-mono font-bold">DIE</span>.
                </p>
                <p>
                  Unlike "cc checker top" tools that attempt unauthorized micro-transactions (illegal &amp; unethical), our <strong>checker cc live</strong> is <strong>100% client-side</strong>. No card data ever leaves your browser. No banking network is contacted.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">How to Use This CC Checker</h2>
              <div className="prose-custom">
                <ol className="space-y-4 list-decimal list-inside">
                  <li>
                    <strong>Format your cards:</strong> One card per line. Supported: <code>Number|MM|YYYY|CVV</code>, colon-separated, or space-separated.
                  </li>
                  <li>
                    <strong>Paste &amp; start:</strong> Paste into the terminal above and click <strong>START</strong>. The bulk cc checker processes hundreds of cards instantly.
                  </li>
                  <li>
                    <strong>Read results:</strong> Each card gets a <span className="text-green-400 font-mono">LIVE</span> / <span className="text-red-400 font-mono">DIE</span> / <span className="text-yellow-400 font-mono">UNKN</span> status plus network, confidence score, and BIN details.
                  </li>
                  <li>
                    <strong>Export:</strong> Download live or dead results as CSV with one click.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">What This CC Checker Validates</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold">Check</th>
                    <th className="text-left px-6 py-4 font-semibold">What it means</th>
                    <th className="text-left px-6 py-4 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Luhn Algorithm", "Card number has valid mathematical checksum", "LIVE / DIE"],
                    ["Expiry Date", "Card has not passed its expiration month/year", "LIVE / DIE"],
                    ["CVV Format", "CVV length matches network (3 or 4 digits)", "Detail flag"],
                    ["BIN Lookup", "First 6–8 digits match a real issuing bank", "Bank + Country"],
                    ["Network Detection", "Prefix identifies Visa, MC, Amex, etc.", "Network badge"],
                    ["Test Card Detection", "Known test sequences (e.g. 4242 4242…) flagged", "test_card flag"],
                  ].map(([check, meaning, result]) => (
                    <tr key={check} className="hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-primary font-medium">{check}</td>
                      <td className="px-6 py-4 text-muted-foreground">{meaning}</td>
                      <td className="px-6 py-4 font-mono text-xs text-foreground">{result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="py-24 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Supported Card Networks</h2>
            <p className="text-muted-foreground">Our free <strong>credit card checker</strong> auto-detects networks via industry-standard BIN prefixes.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Visa', 'Mastercard', 'Amex', 'Discover', 'UnionPay', 'JCB', 'Diners'].map(network => (
              <div key={network} className="bg-background border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors group">
                <CreditCard className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="font-bold">{network}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why EEAT section */}
      <section className="py-24 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Developers & Security Researchers Use This Tool</h2>
              <div className="prose-custom">
                <p>
                  Payment gateway developers need to test checkout flows with structurally valid card numbers that will not accidentally process real transactions. Our <strong>bulk cc checker</strong> generates instant Luhn-valid results from any card list, making integration testing faster.
                </p>
                <p>
                  E-commerce QA teams use our <strong>credit card validator with CVV</strong> to confirm their front-end validation logic catches bad formats before an API call is ever made — reducing unnecessary charge attempts and API costs.
                </p>
                <p>
                  Security researchers studying card generation patterns rely on the <strong>BIN checker CC</strong> feature to correlate card ranges with real issuers, verify BIN validity, and identify prepaid vs credit card types from public issuer data.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { title: "Zero network requests for card data", desc: "Luhn validation is pure math — no card number ever travels over the wire." },
                { title: "Open Luhn implementation", desc: "Our algorithm is the standard mod-10 checksum, auditable and transparent." },
                { title: "BIN data from public registry", desc: "BIN lookups use binlist.net, a well-known open BIN database — no proprietary or private data." },
                { title: "No registration, no tracking", desc: "No account required. No analytics on card data. No cookies storing your inputs." },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ mini */}
      <section className="py-24 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-8">Quick answers about how our <strong>live cc checker</strong> works.</p>
          <div className="space-y-4 text-left">
            {[
              { q: "Is this CC checker free?", a: "Yes — 100% free, unlimited checks, no account needed. Runs entirely in your browser." },
              { q: "Does this store my card data?", a: "No. This is pure client-side JavaScript. Your data never leaves your device — no backend receives card numbers." },
              { q: "Can it check credit card with balance?", a: "Our tool validates mathematical structure (Luhn + BIN + expiry). Actual account balance requires logging into your bank — no third-party tool can check that without your credentials." },
              { q: "What is 'checker cc live'?", a: "It's a common search term for tools that test whether a card passes Luhn + expiry checks (marking it as 'live' = structurally valid). Our tool does exactly this, entirely in-browser." },
            ].map(({ q, a }) => (
              <div key={q} className="border border-border rounded-lg p-6 bg-card text-left">
                <h3 className="font-bold text-base mb-2 text-foreground">{q}</h3>
                <p className="text-muted-foreground text-sm">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/faq" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
              View all FAQs <CheckCircle2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
