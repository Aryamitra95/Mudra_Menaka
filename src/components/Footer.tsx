import { Hand } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Hand className="h-5 w-5 text-background" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mudra Menaka
            </span>
          </div>
          
          <p className="text-muted-foreground text-center md:text-left">
            Preserving Indian classical dance heritage through AI and machine learning
          </p>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Mudra Menaka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
