import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroDance from "@/assets/hero-dance.jpg";

const HeroSection = () => {
  const scrollToDemo = () => {
    const element = document.getElementById("demo");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background dance image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroDance} 
          alt="Indian classical dance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-primary/40" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/40 to-transparent rounded-full blur-3xl animate-glow-pulse" />
        </div>
      </div>

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-accent rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-primary rounded-full animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
            Mudra Menaka
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
            An AI-powered tool that identifies hand gestures (mudras) in Bharatiya Natya forms
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            Using advanced machine learning and MediaPipe to preserve and celebrate
            <br className="hidden md:block" />
            the rich tradition of Indian classical dance with precision and speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={scrollToDemo}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 group"
            >
              Try the Prototype
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="border-primary/50 text-foreground hover:bg-primary/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
