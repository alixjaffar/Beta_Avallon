import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer className="w-full py-20 mt-20 relative overflow-hidden">
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Use Cases */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-6">Use Cases</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Website Builder
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  AI Agents
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Domain Management
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Automation
                </a>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-6">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-6">Stay Connected</h4>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-background/50"
                />
                <Button size="icon" variant="secondary">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-primary hover:text-primary-foreground">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-primary hover:text-primary-foreground">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large Background Text - Full Width */}
      <div className="absolute bottom-[-5%] left-0 right-0 w-full pointer-events-none z-0">
        <h2 className="text-[28vw] md:text-[24vw] font-bold leading-none opacity-[0.03] dark:opacity-[0.08] select-none text-foreground">
          Avallon
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
