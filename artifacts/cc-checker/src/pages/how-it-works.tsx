import { SEOHead } from "@/components/seo-head";

export default function HowItWorks() {
  return (
    <div className="flex flex-col w-full">
      <SEOHead 
        title="How CC Checker Works - Luhn Algorithm Explained" 
        description="Learn how credit card checkers work. We explain the Luhn algorithm, BIN network detection, and what Live vs Die means in card validation."
        canonicalUrl="https://ccvalidator.pro/how-it-works"
      />

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          How <span className="text-primary glow-live">CC Checker</span> Works
        </h1>
        
        <article className="prose-custom">
          <p className="text-xl text-foreground/80 lead">
            Understanding how credit card validation works is essential for developers building payment gateways and security researchers testing systems. This guide explains the mechanics behind our free CC checker.
          </p>

          <h2 className="mt-12 text-3xl">The Core Mechanism: The Luhn Algorithm</h2>
          <p>
            When you enter a card number into our bulk cc checker, the first thing it does is strip away formatting and run the number through the <strong>Luhn algorithm</strong> (also known as the "modulus 10" or "mod 10" algorithm). 
          </p>
          <p>
            Invented by IBM scientist Hans Peter Luhn in 1954, this simple checksum formula is used to validate a variety of identification numbers, such as credit card numbers, IMEI numbers, and National Provider Identifier numbers. It is not designed to protect against malicious attacks, but rather to protect against accidental errors like mistyping a digit.
          </p>

          <div className="bg-card border border-border p-6 rounded-xl my-8 font-mono text-sm">
            <h3 className="text-foreground font-bold mb-4 font-sans text-lg mt-0">Luhn Algorithm Step-by-Step</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Starting from the rightmost digit (the check digit), double the value of every second digit.</li>
              <li>If doubling a digit results in a number greater than 9 (e.g., 7 × 2 = 14), add the digits of the product together (e.g., 1 + 4 = 5).</li>
              <li>Sum all the digits.</li>
              <li>If the total modulo 10 is equal to 0 (the sum ends in 0), the number is valid.</li>
            </ol>
          </div>

          <h2 className="mt-12 text-3xl">BIN Numbers and Network Detection</h2>
          <p>
            The first 6 to 8 digits of a credit card number are known as the Issuer Identification Number (IIN) or Bank Identification Number (BIN). Our live cc checker uses these prefixes to determine the card network (Visa, Mastercard, Amex, etc.).
          </p>
          <ul>
            <li><strong>Visa:</strong> Always begins with 4.</li>
            <li><strong>Mastercard:</strong> Begins with 51–55 or 2221–2720.</li>
            <li><strong>American Express:</strong> Begins with 34 or 37.</li>
            <li><strong>Discover:</strong> Begins with 6011, 622126–622925, 644–649, or 65.</li>
          </ul>

          <h2 className="mt-12 text-3xl">Understanding "Live", "Die", and "Unknown"</h2>
          <p>
            In the context of this specific cc checker top utility, the status badges have very specific technical meanings:
          </p>
          <div className="space-y-4 my-6">
            <div className="p-4 border-l-4 border-live bg-live/5 rounded-r">
              <h3 className="font-bold text-live flex items-center gap-2 m-0 text-lg"><span className="px-2 py-0.5 bg-live/20 rounded text-sm">LIVE</span> Potential Valid Card</h3>
              <p className="mt-2 mb-0">The card number perfectly satisfies the Luhn algorithm checksum AND the provided expiration date is in the future. Mathematically, this card <em>could</em> exist and be active.</p>
            </div>
            <div className="p-4 border-l-4 border-die bg-die/5 rounded-r">
              <h3 className="font-bold text-die flex items-center gap-2 m-0 text-lg"><span className="px-2 py-0.5 bg-die/20 rounded text-sm">DIE</span> Invalid Card</h3>
              <p className="mt-2 mb-0">The card fails the Luhn algorithm, OR the expiration date provided is in the past. It is structurally impossible for this card to be processed successfully.</p>
            </div>
            <div className="p-4 border-l-4 border-unknown bg-unknown/5 rounded-r">
              <h3 className="font-bold text-unknown flex items-center gap-2 m-0 text-lg"><span className="px-2 py-0.5 bg-unknown/20 rounded text-sm">UNKN</span> Parsing Error</h3>
              <p className="mt-2 mb-0">The input string could not be parsed into a recognizable format (Number, Month, Year, CVV). Please check your formatting.</p>
            </div>
          </div>

          <h2 className="mt-12 text-3xl text-destructive">Important Disclaimer</h2>
          <p>
            This tool is built strictly for educational purposes, software testing, and security research. It operates entirely locally within your browser using JavaScript. No card data is ever transmitted to a server, and no real authorization requests are made to any banking networks. Using stolen credit card numbers is a federal crime.
          </p>
        </article>
      </div>
    </div>
  );
}