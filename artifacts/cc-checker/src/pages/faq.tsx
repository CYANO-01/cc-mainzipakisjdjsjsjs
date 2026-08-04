import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "What is a CC checker?",
      a: "A CC checker is an online tool used to validate the mathematical accuracy of a credit card number. It verifies that the number follows the correct format, passes the Luhn algorithm checksum, and checks if the expiration date is valid."
    },
    {
      q: "How do I use a live CC checker?",
      a: "Simply paste your list of credit cards into the terminal input box on our homepage. Ensure they are in a supported format like 'Number|Month|Year|CVV'. Then click 'Start' to let the tool process the list and categorize them into Live or Die statuses."
    },
    {
      q: "What does Live/Die/Unknown mean?",
      a: "'Live' means the card passes all mathematical checks and hasn't expired. 'Die' means the card fails the Luhn algorithm or the expiration date is in the past. 'Unknown' means the tool couldn't parse the format of the line."
    },
    {
      q: "What card formats does this checker support?",
      a: "We support multiple formats including standard pipe (Number|MM|YYYY|CVV), short year pipe (Number|MM|YY|CVV), colon separated (Number:MM:YYYY:CVV), and space separated formats. If your format is standard, our parser will likely detect it."
    },
    {
      q: "Is this CC checker free?",
      a: "Yes. Our bulk CC checker tool is 100% free with no hidden fees or rate limits. You can check as many cards as your browser can handle."
    },
    {
      q: "What is the Luhn algorithm?",
      a: "The Luhn algorithm (modulus 10) is a simple checksum formula used to validate identification numbers, including credit cards. It helps detect accidental errors, like mistyping a single digit, before sending the number for processing."
    },
    {
      q: "How accurate is this CC checker?",
      a: "Our tool accurately validates the mathematical structure of the card (Luhn check) and the logical structure (network prefix, expiration date). However, because it operates locally without making unauthorized micro-transactions, it cannot verify if the card has actual funds or is reported stolen."
    },
    {
      q: "What card networks are supported?",
      a: "Our tool automatically detects major networks based on BIN prefixes, including Visa, Mastercard, American Express, Discover, UnionPay, JCB, and Diners Club."
    },
    {
      q: "Can I check VCC (virtual credit cards)?",
      a: "Yes. A VCC follows the exact same mathematical rules as a physical credit card. If you generate test VCCs, our tool will validate their format perfectly."
    },
    {
      q: "Is using a CC checker legal?",
      a: "Using a CC checker to validate the format of test cards for educational or software testing purposes is completely legal. However, attempting to check or use stolen credit card numbers is a federal crime. This tool is strictly for educational and testing use."
    },
    {
      q: "What is the difference between this and a 'cc checker top' tool?",
      a: "Many tools advertising as a 'cc checker top' or similar perform illegal micro-transactions to test real validity. Our tool operates entirely client-side, validating the mathematical format safely and legally without interacting with banking systems."
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <SEOHead 
        title="CC Checker FAQ - Common Questions About Credit Card Checking" 
        description="Find answers to common questions about how our free live CC checker works, supported formats, and card validation."
        canonicalUrl="https://ccvalidator.pro/faq"
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked <span className="text-primary glow-live">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our bulk credit card validation tool.
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <article key={index} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm hover:border-primary/30 transition-colors">
              <h2 className="text-xl font-bold mb-3 text-foreground flex items-start gap-3">
                <span className="text-primary mt-1"><CheckCircle2 className="w-5 h-5"/></span>
                {faq.q}
              </h2>
              <p className="text-muted-foreground leading-relaxed pl-8">
                {faq.a}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center bg-muted/30 border border-border rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to test?</h3>
          <p className="text-muted-foreground mb-6">
            Head over to our main tool and start validating your test cards instantly.
          </p>
          <Link href="/">
            <button className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-md hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,255,163,0.3)]">
              Open CC Checker
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}