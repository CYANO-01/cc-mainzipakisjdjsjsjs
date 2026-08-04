import { Link } from "wouter";
import { Terminal, ArrowLeft } from "lucide-react";
import { SEOHead } from "@/components/seo-head";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      <SEOHead 
        title="404 - Page Not Found | CC Checker" 
        description="The page you are looking for does not exist."
      />
      
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full border border-die/30 bg-die/5 flex items-center justify-center relative overflow-hidden group">
            <Terminal className="w-10 h-10 text-die relative z-10" />
            <div className="absolute inset-0 bg-die/10 animate-pulse"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-mono">
          <span className="text-die glow-die">404</span>_NOT_FOUND
        </h1>
        
        <p className="text-muted-foreground text-lg">
          The requested path could not be resolved in the system. The endpoint may have been moved or deleted.
        </p>
        
        <div className="pt-8">
          <Link href="/">
            <button className="bg-card border border-border text-foreground hover:border-primary hover:text-primary transition-colors px-6 py-3 rounded-md inline-flex items-center gap-2 font-mono text-sm">
              <ArrowLeft className="w-4 h-4" />
              RETURN_TO_ROOT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}