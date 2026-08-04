import { Link, useLocation } from "wouter";
import { CheckCircle2, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight font-mono">
              CC<span className="text-primary">Checker</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button 
            className="md:hidden text-muted-foreground hover:text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-card/50 py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="font-bold font-mono">CC Checker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Educational and security research tool.
            </p>
          </div>
          
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>
            Disclaimer: This tool validates credit card formats using the Luhn algorithm and checks expiry dates locally. 
            It does not perform real transactions or interact with banking systems. For educational use only.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} CC Checker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}