import Link from "next/link";
import { Github, RefreshCw, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <RefreshCw className="h-5 w-5 text-[#0F9D58]" /> {/* Google Sheets green color */}
            </div>
            <span className="font-semibold font-sans">FormSync</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect your forms to Google Sheets in seconds.
          </p>
        </div>
        
        <nav className="flex gap-4 md:gap-6">
          <Link 
            href="/pricing" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link 
            href="/docs" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Documentation
          </Link>
          <Link 
            href="/blog" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/yourusername/formsync" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a 
            href="https://twitter.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>
      
      <div className="container mt-6 md:mt-8 px-4 md:px-6">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} FormSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
