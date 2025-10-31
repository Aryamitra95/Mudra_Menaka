import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import mudraHands from "@/assets/mudra-hands.jpg";
import HandGestureDetector from "./HandGestureDetector";

const DemoSection = () => {
  const startDetector = () => {
    document.getElementById("detector")?.scrollIntoView({ behavior: "smooth" });
    // Also toggle the detector to start if it's waiting for a user action
    window.dispatchEvent(new Event("start-detector"));
  };

  return (
    <section id="demo" className="py-24 relative">
      {/* Background with dance imagery */}
      <div className="absolute inset-0">
        <img 
          src={mudraHands} 
          alt="Mudra hands" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="py-4 text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Try Our Prototype
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Use your camera to identify mudras in real-time
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border-border p-8 md:p-12 text-center">
          <div className="space-y-8">
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <Camera className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-foreground">Real-time Camera Detection</h3>
              <p className="text-muted-foreground">Click the button below to start your camera and run live detection.</p>
            </div>
              <HandGestureDetector/>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">Camera runs locally in your browser. No images are uploaded.</p>
      </div>
    </section>
  );
};

export default DemoSection;
