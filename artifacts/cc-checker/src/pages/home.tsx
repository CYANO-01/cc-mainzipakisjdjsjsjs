import { SEOHead } from "@/components/seo-head";
import { CheckerTool } from "@/components/checker-tool";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <SEOHead 
        title="CC Checker - Free Live Credit Card Checker | Validate Cards Online" 
        description="Free CC checker tool to validate credit card numbers online. Check if cards are live or dead using Luhn algorithm. Bulk CC checker supporting Visa, Mastercard, Amex, Discover."
        canonicalUrl="https://ccvalidator.pro/"
      />

      {/* Hero / Tool Section */}
      <section className="pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="container mx-auto relative z-10 text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Free <span className="text-primary">CC Checker</span><br/> Validate Cards Instantly
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The fastest bulk live credit card checker. Validate numbers, detect networks, and check Luhn algorithms securely in your browser. No data leaves your device.
          </p>
        </div>

        <CheckerTool />
      </section>

      {/* SEO Content Sections */}
      <section className="py-24 bg-card/50 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            <div>
              <h2 className="text-3xl font-bold mb-6">What is a CC Checker?</h2>
              <div className="prose-custom">
                <p>
                  A <strong>cc checker</strong> (credit card checker) is an online utility designed to validate credit card numbers in bulk. Security researchers, payment gateway developers, and e-commerce testers use our live cc checker to verify if a card number follows the mathematical rules that make it valid.
                </p>
                <p>
                  Our tool processes the cards through the <strong>Luhn algorithm</strong> (modulus 10), which is the standard checksum formula used by major card networks. If a card passes this mathematical check, it is theoretically capable of being a "Live" card. If it fails, or if the expiration date is in the past, the cc checker marks it as "Die" (invalid).
                </p>
                <p>
                  Unlike a traditional "vcc checker" or "cc checker top" that might attempt unauthorized micro-transactions (which is illegal and unethical), our tool is <strong>100% client-side and safe</strong>. It validates the format, network, and checksum purely through mathematical validation, ensuring your testing data remains private.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">How to Use This CC Checker</h2>
              <div className="prose-custom">
                <ol className="space-y-4 list-decimal list-inside">
                  <li>
                    <strong>Format your data:</strong> Ensure your list of cards is formatted correctly. We support one card per line.
                  </li>
                  <li>
                    <strong>Paste the cards:</strong> Paste your list into the terminal input box above. The tool handles hundreds of cards instantly.
                  </li>
                  <li>
                    <strong>Adjust settings (optional):</strong> Click the settings icon to add a delay between checks if you want to simulate slower processing.
                  </li>
                  <li>
                    <strong>Start the check:</strong> Click "START". The bulk cc checker will process each line, extract the number, month, year, and CVV.
                  </li>
                  <li>
                    <strong>Interpret Results:</strong> 
                    <br/><span className="text-live font-mono bg-live/10 px-1 rounded">LIVE</span> = Passes Luhn check and is not expired.
                    <br/><span className="text-die font-mono bg-die/10 px-1 rounded">DIE</span> = Fails Luhn check or is expired.
                    <br/><span className="text-unknown font-mono bg-unknown/10 px-1 rounded">UNKN</span> = Unrecognized format.
                  </li>
                  <li>
                    <strong>Export:</strong> Click "COPY LIVE" to copy all valid cards, or download the full text report.
                  </li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-12">Supported Card Formats</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left font-mono text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Format Name</th>
                  <th className="px-6 py-4 font-semibold">Example</th>
                  <th className="px-6 py-4 font-semibold">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">Standard Pipe</td>
                  <td className="px-6 py-4">4532XXXXXXXXXXXX|12|2025|123</td>
                  <td className="px-6 py-4 text-live flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Yes</td>
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">Short Year Pipe</td>
                  <td className="px-6 py-4">5123XXXXXXXXXXXX|08|26|456</td>
                  <td className="px-6 py-4 text-live flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Yes</td>
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">Colon Separated</td>
                  <td className="px-6 py-4">3712XXXXXXXXXXX:10:2024:7890</td>
                  <td className="px-6 py-4 text-live flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Yes</td>
                </tr>
                <tr className="hover:bg-accent/30 transition-colors">
                  <td className="px-6 py-4">Space Separated</td>
                  <td className="px-6 py-4">6011XXXXXXXXXXXX 01 2027 123</td>
                  <td className="px-6 py-4 text-live flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Supported Card Networks</h2>
            <p className="text-muted-foreground">Our free cc checker automatically detects card networks using industry-standard BIN prefixes.</p>
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

      <section className="py-24 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-8">
            Have questions about how our live cc checker works? We've got answers.
          </p>
          <div className="space-y-4 text-left">
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="font-bold text-lg mb-2 text-foreground">Is this CC checker free?</h3>
              <p className="text-muted-foreground text-sm">Yes, our bulk cc checker is 100% free to use with no hidden limits. It runs entirely in your browser.</p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="font-bold text-lg mb-2 text-foreground">Are the checked cards saved?</h3>
              <p className="text-muted-foreground text-sm">No. Because this is a client-side javascript application, your data never leaves your device. No backend API calls are made with your card data.</p>
            </div>
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