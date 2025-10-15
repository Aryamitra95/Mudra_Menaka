import { Button } from "@/components/ui/button";
import { Hand } from "lucide-react";

const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <img src="/logo.png" alt="Mudra Menaka" className="h-6 w-6 text-background" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mudra Menaka
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("technology")}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Technology
            </button>
            <button 
              onClick={() => scrollToSection("mudras")}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Mudras
            </button>
            <Button 
              onClick={() => scrollToSection("demo")}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Try Demo
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
