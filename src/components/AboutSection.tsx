import { Card, CardContent } from "@/components/ui/card";
import { Brain, Eye, Zap } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Machine Learning Powered",
      description: "Advanced neural networks trained on thousands of mudra images for accurate recognition"
    },
    {
      icon: Eye,
      title: "Real-time Detection",
      description: "Instant mudra identification using MediaPipe's hand tracking technology"
    },
    {
      icon: Zap,
      title: "Cultural Preservation",
      description: "Digitizing and preserving the ancient art of Indian classical dance for future generations"
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="py-4 text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Preserving Heritage Through Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mudras are symbolic hand gestures used in Bharatiya Natya (Indian classical dance) 
            to convey emotions, stories, and spiritual concepts. Our AI system helps dancers, 
            students, and researchers identify and learn these ancient gestures with unprecedented accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
