import { SEOHead } from "@/components/seo-head";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

const faqs = [
  {
    q: "What is a CC checker?",
    a: "A CC checker is an online tool that validates the mathematical structure of a credit card number. It verifies the number passes the Luhn algorithm checksum, the CVV length matches the card network, and the expiration date is still valid. It does not access banking systems or check real account status."
  },
  {
    q: "How do I use this live CC checker?",
    a: "Paste your list of credit cards into the input box on the homepage — one card per line in a supported format like 'Number|Month|Year|CVV'. Click START and the bulk cc checker will instantly validate each line and show LIVE, DIE, or UNKN status with details."
  },
  {
    q: "What does Live / Die / Unknown mean?",
    a: "'LIVE' means the card passes all mathematical checks: valid Luhn checksum, non-expired date, and (optionally) a real BIN from a known issuer. 'DIE' means it fails the Luhn algorithm, is expired, or the BIN does not exist in any issuer database. 'UNKN' means the input line could not be parsed into a valid card format."
  },
  {
    q: "Can this check credit card with balance?",
    a: "Our credit card checker with balance capability covers the structural prerequisites: valid Luhn number, valid BIN from a real issuer, and non-expired date. Actual account balance can only be checked by logging into your bank or issuer portal — no third-party tool can access live balance data without making unauthorized transactions."
  },
  {
    q: "What is a credit card validator with CVV?",
    a: "A credit card validator with CVV checks both the card number (via the Luhn algorithm) and whether the CVV is the correct length for its network: 3 digits for Visa, Mastercard, Discover, JCB, and Diners; 4 digits for American Express. Our tool flags CVV length mismatches in the result detail view."
  },
  {
    q: "What is a BIN checker CC?",
    a: "A BIN checker CC (Bank Identification Number checker) reads the first 6–8 digits of a card number to identify the issuing bank, country of issue, card type (debit/credit/prepaid), and network. Our tool performs this lookup automatically using the public binlist.net API — only the BIN prefix is ever transmitted, never the full card number."
  },
  {
    q: "What is 'checker cc live'?",
    a: "'Checker cc live' is a commonly searched term for tools that categorize credit card numbers as live (structurally valid) or dead (invalid). Our checker cc live tool does exactly this using the Luhn algorithm and expiry validation, entirely within your browser. No gateway calls are made."
  },
  {
    q: "What card formats does this checker support?",
    a: "We support: standard pipe (Number|MM|YYYY|CVV), short-year pipe (Number|MM|YY|CVV), colon-separated (Number:MM:YYYY:CVV), and space-separated formats. Our parser auto-detects the format and extracts all four fields."
  },
  {
    q: "Is this CC checker free?",
    a: "Yes. Our bulk CC checker is 100% free with no hidden fees, no rate limits, and no account required. There is no limit on how many cards you can check in a session."
  },
  {
    q: "What is the Luhn algorithm?",
    a: "The Luhn algorithm (modulus 10) is a checksum formula invented by IBM scientist Hans Peter Luhn in 1954. It is used by every major card network to detect accidental digit errors in card numbers. A valid card number will always produce a sum divisible by 10 when processed through the algorithm."
  },
  {
    q: "How accurate is this credit card checker?",
    a: "Our tool accurately validates the mathematical structure (Luhn check), format logic (CVV length, expiry), and BIN registry presence. It cannot verify actual authorization status, available credit, or whether a card is blocked — those checks require live bank network access."
  },
  {
    q: "Does this tool store my card data?",
    a: "No. This is a 100% client-side application built in JavaScript. Your card data is processed entirely in your browser and is never transmitted to any server. No database stores your card numbers."
  },
  {
    q: "What card networks are supported?",
    a: "Visa, Mastercard, American Express, Discover, UnionPay, JCB, and Diners Club. Network is detected automatically from the BIN prefix."
  },
  {
    q: "Can I check virtual credit cards (VCC)?",
    a: "Yes. Virtual credit cards follow the same Luhn rules as physical cards. If your VCC is generated correctly, our validator will process it identically to a physical card."
  },
  {
    q: "What does 'check pre approval credit cards' mean?",
    a: "Pre-approval checks are a completely different concept. They are soft-pull inquiries run by banks (like Capital One, Chase, or Discover) to see if you qualify for a new credit card offer without affecting your credit score. Our CC checker validates existing card number formats — it has nothing to do with credit applications or pre-qualification. For pre-approval checks, visit your bank's website directly."
  },
  {
    q: "Is using a CC checker legal?",
    a: "Validating card formats for educational use, software testing, or security research is completely legal. Our tool does not interact with banking networks and makes no transactions. Using stolen credit card numbers in any tool is a federal crime regardless of the tool used."
  },
  {
    q: "What is the difference between this and 'cc checker top' tools?",
    a: "Many sites advertising 'cc checker top' perform illegal micro-transactions against real payment gateways to test stolen card numbers. Our tool is entirely browser-side and makes zero banking system calls. LIVE status means the card passes mathematical validation only — not that it is authorized or active."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
};

export default function FAQ() {
  return (
    <div className="flex flex-col w-full">
      <SEOHead
        title="CC Checker FAQ – Credit Card Validator, CVV Checker & BIN Lookup Questions"
        description="Answers to all common questions about our free CC checker, credit card validator with CVV, BIN checker CC, credit card checker with balance, checker cc live, and more."
        canonicalUrl="https://ccvalidator.pro/faq"
        jsonLd={faqSchema}
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our <strong>bulk CC checker</strong>, <strong>credit card validator with CVV</strong>, and <strong>BIN checker CC</strong> tool.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article key={index} className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm hover:border-primary/30 transition-colors">
              <h2 className="text-xl font-bold mb-3 text-foreground flex items-start gap-3">
                <span className="text-primary mt-1 flex-shrink-0"><CheckCircle2 className="w-5 h-5" /></span>
                {faq.q}
              </h2>
              <p className="text-muted-foreground leading-relaxed pl-8">{faq.a}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center bg-muted/30 border border-border rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to validate?</h3>
          <p className="text-muted-foreground mb-6">
            Head to our free <strong>cc checker</strong> and start validating your test cards instantly — no signup needed.
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
