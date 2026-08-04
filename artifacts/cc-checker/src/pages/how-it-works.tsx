import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use a CC Checker to Validate Credit Cards",
  "description": "Step-by-step guide to validating credit card numbers, CVV, and BIN with our free credit card checker.",
  "totalTime": "PT1M",
  "tool": [{ "@type": "HowToTool", "name": "CC Checker (ccvalidator.pro)" }],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Format your card list",
      "text": "Prepare cards one per line in format: Number|MM|YYYY|CVV. Also supports colon and space-separated formats."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Paste into the checker",
      "text": "Paste the list into the terminal input box on the homepage. The bulk cc checker handles hundreds of cards instantly."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Click START",
      "text": "The credit card checker runs the Luhn algorithm, validates CVV length, checks expiry, and optionally looks up the BIN."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Read results",
      "text": "Each card gets LIVE (valid structure), DIE (invalid), or UNKN (parse error), plus network name, confidence score, and BIN issuer details."
    }
  ]
};

export default function HowItWorks() {
  return (
    <div className="flex flex-col w-full">
      <SEOHead
        title="How CC Checker Works – Credit Card Validator with CVV & BIN Checker Guide"
        description="Learn how our credit card checker validates CVV, checks BIN issuer, and uses the Luhn algorithm to determine live/dead status. Full technical guide for developers."
        canonicalUrl="https://ccvalidator.pro/how-it-works"
        jsonLd={howToSchema}
      />

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          How Our <span className="text-primary">Credit Card Checker</span> Works
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          A complete technical guide to the Luhn algorithm, CVV validation, BIN lookup, and what live/die status actually means in our <strong>checker cc live</strong> tool.
        </p>

        <article className="prose-custom">

          {/* Step 1: Luhn */}
          <h2 className="mt-0 text-3xl">Step 1 — The Luhn Algorithm (Core Validation)</h2>
          <p>
            Every card number entered into our <strong>credit card checker</strong> is first run through the <strong>Luhn algorithm</strong> (modulus 10). Invented by IBM scientist Hans Peter Luhn in 1954, this checksum formula is the universal standard used by Visa, Mastercard, Amex, and all major networks to detect accidental digit errors.
          </p>

          <div className="bg-card border border-border p-6 rounded-xl my-8 font-mono text-sm">
            <h3 className="text-foreground font-bold mb-4 font-sans text-lg mt-0">Luhn Algorithm — Step by Step</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Starting from the rightmost digit, double every second digit moving left.</li>
              <li>If doubling produces a number &gt; 9 (e.g. 7×2=14), subtract 9 (or add the two digits: 1+4=5).</li>
              <li>Sum all digits together.</li>
              <li>If the total modulo 10 equals 0, the number is <span className="text-green-400">valid (LIVE)</span>. Otherwise it is <span className="text-red-400">invalid (DIE)</span>.</li>
            </ol>
          </div>

          <p>
            This is the same check every payment terminal runs before even attempting network authorization. A card that fails Luhn will never reach a bank — which is why this single check is the most reliable way to identify structurally invalid numbers.
          </p>

          {/* Step 2: CVV */}
          <h2 className="mt-12 text-3xl">Step 2 — Credit Card Validator with CVV</h2>
          <p>
            After the Luhn check, our <strong>credit card validator with CVV</strong> confirms the Card Verification Value is the correct length for the detected network:
          </p>
          <ul>
            <li><strong>Visa, Mastercard, Discover, UnionPay, JCB, Diners:</strong> CVV must be exactly 3 digits.</li>
            <li><strong>American Express:</strong> CID must be exactly 4 digits.</li>
          </ul>
          <p>
            A mismatch between the CVV length and the card network is flagged as a detail warning. The card is not automatically marked DIE for CVV mismatch alone — but the confidence score is reduced, and the flag is visible in the result.
          </p>
          <div className="bg-card border border-border p-5 rounded-xl my-6 text-sm text-muted-foreground">
            <strong className="text-foreground block mb-2">Important:</strong>
            CVV validation here checks only the <em>format</em> (correct number of digits for the network). We do not — and cannot — verify the cryptographic correctness of a CVV without contacting the issuing bank. No third-party tool can do this without unauthorized gateway access.
          </div>

          {/* Step 3: Expiry */}
          <h2 className="mt-12 text-3xl">Step 3 — Expiry Date Check</h2>
          <p>
            The provided month and year are compared against today's date. A card with an expiry date in the past is marked <span className="text-red-400 font-mono font-bold">DIE</span> regardless of its Luhn result. A future expiry contributes positively to the confidence score.
          </p>

          {/* Step 4: BIN Lookup */}
          <h2 className="mt-12 text-3xl">Step 4 — BIN Checker CC (Issuer Lookup)</h2>
          <p>
            The first 6–8 digits of any card number form the <strong>Bank Identification Number (BIN)</strong>, also called the Issuer Identification Number (IIN). Our <strong>bin checker CC</strong> feature queries the public <a href="https://binlist.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">binlist.net</a> registry to retrieve:
          </p>
          <ul>
            <li><strong>Issuing bank name</strong> — e.g. "Chase", "Bank of America"</li>
            <li><strong>Country</strong> — the country of the issuing bank</li>
            <li><strong>Card type</strong> — debit, credit, or prepaid</li>
            <li><strong>Network</strong> — confirmed Visa, Mastercard, Amex, etc.</li>
          </ul>
          <p>
            If the BIN does not exist in any real issuer database, the card is immediately downgraded to <span className="text-red-400 font-mono font-bold">DIE</span> with a <code>bin_not_found</code> flag. If BIN lookup is confirmed, the confidence score is boosted by up to +25 points.
          </p>
          <p>
            BIN lookup results are cached for 24 hours in-browser. No card numbers are ever sent to the BIN API — only the first 6–8 digits (which are publicly non-sensitive).
          </p>

          {/* Credit card checker with balance */}
          <h2 className="mt-12 text-3xl">Credit Card Checker with Balance — What It Means</h2>
          <p>
            Searches for a "<strong>credit card checker with balance</strong>" are common, but it's important to understand what any tool can and cannot verify:
          </p>
          <div className="overflow-x-auto rounded-xl border border-border my-6">
            <table className="w-full text-sm">
              <thead className="bg-card border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">What you want to know</th>
                  <th className="text-left px-5 py-3 font-semibold">Can our tool check it?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-card/50">
                  <td className="px-5 py-4">Is the card number structurally valid?</td>
                  <td className="px-5 py-4 text-green-400 font-semibold">✓ Yes — via Luhn algorithm</td>
                </tr>
                <tr className="hover:bg-card/50">
                  <td className="px-5 py-4">Is this BIN from a real issuing bank?</td>
                  <td className="px-5 py-4 text-green-400 font-semibold">✓ Yes — via BIN lookup</td>
                </tr>
                <tr className="hover:bg-card/50">
                  <td className="px-5 py-4">Has the card expired?</td>
                  <td className="px-5 py-4 text-green-400 font-semibold">✓ Yes — via expiry check</td>
                </tr>
                <tr className="hover:bg-card/50">
                  <td className="px-5 py-4">Does the card have available credit / balance?</td>
                  <td className="px-5 py-4 text-red-400 font-semibold">✗ No — requires bank API access</td>
                </tr>
                <tr className="hover:bg-card/50">
                  <td className="px-5 py-4">Is the card reported stolen or blocked?</td>
                  <td className="px-5 py-4 text-red-400 font-semibold">✗ No — requires issuer network access</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            No legitimate third-party tool can check actual card balance or stolen status without making an authorization request to the issuer's network. Any tool claiming to do so is either making unauthorized transactions (illegal) or fabricating results. Our <strong>credit card checker</strong> is transparent about exactly what it validates.
          </p>

          {/* Live/Die/Unknown */}
          <h2 className="mt-12 text-3xl">Understanding LIVE, DIE, and UNKNOWN</h2>
          <div className="space-y-4 my-6">
            <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded-r">
              <h3 className="font-bold text-green-400 flex items-center gap-2 m-0 text-lg">
                <span className="px-2 py-0.5 bg-green-500/20 rounded text-sm font-mono">LIVE</span> Structurally Valid Card
              </h3>
              <p className="mt-2 mb-0 text-sm text-muted-foreground">
                Passes Luhn checksum AND expiry date is in the future AND (if BIN lookup enabled) BIN exists in the issuer registry. This card <em>could</em> exist as an active card. It does not mean the card has funds or is authorized.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-500 bg-red-500/5 rounded-r">
              <h3 className="font-bold text-red-400 flex items-center gap-2 m-0 text-lg">
                <span className="px-2 py-0.5 bg-red-500/20 rounded text-sm font-mono">DIE</span> Invalid Card
              </h3>
              <p className="mt-2 mb-0 text-sm text-muted-foreground">
                Fails the Luhn algorithm OR expiry date is in the past OR BIN is not found in any real issuer database. This card is structurally impossible or definitively expired.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-500/5 rounded-r">
              <h3 className="font-bold text-yellow-400 flex items-center gap-2 m-0 text-lg">
                <span className="px-2 py-0.5 bg-yellow-500/20 rounded text-sm font-mono">UNKN</span> Parse Error
              </h3>
              <p className="mt-2 mb-0 text-sm text-muted-foreground">
                The input line could not be parsed. Check that your card is in a supported format: <code>Number|MM|YYYY|CVV</code>.
              </p>
            </div>
          </div>

          <h2 className="mt-12 text-3xl text-red-400">Important Disclaimer</h2>
          <p>
            This tool is built for <strong>educational purposes, software testing, and security research only</strong>. It validates mathematical structure locally — no card data is transmitted to any server, and no banking system is contacted. Using stolen credit card numbers in any context is a federal crime. All test cards should be generated data or your own cards only.
          </p>
        </article>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-md hover:bg-primary/90 transition-all text-center shadow-[0_0_15px_rgba(0,255,163,0.2)]">
            Open CC Checker
          </Link>
          <Link href="/faq" className="flex-1 bg-card border border-border text-foreground font-medium px-6 py-3 rounded-md hover:border-primary/50 transition-all text-center">
            View FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
