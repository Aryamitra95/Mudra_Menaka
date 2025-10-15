import { Card, CardContent } from "@/components/ui/card";
import danceGroup from "@/assets/dance-group.jpg";

const MudraGallery = () => {
  const mudras = [
    {
      name: "Pataka",
      description: "Flag gesture - represents flags, clouds, forest, night, and ocean waves",
      emoji: "🤚"
    },
    {
      name: "Anjali",
      description: "Offering gesture - used in greetings, prayers, and expressions of respect",
      emoji: "🙏"
    },
    {
      name: "Ardhachandra",
      description: "Half-moon gesture - represents the moon, facial expressions, and meditation",
      emoji: "🌙"
    },
    {
      name: "Kapittha",
      description: "Wood-apple gesture - represents Lakshmi, calling, and holding objects",
      emoji: "👌"
    },
    {
      name: "Hamsasya",
      description: "Swan's beak - represents pearls, picking flowers, and delicate movements",
      emoji: "🦢"
    },
    {
      name: "Kartarimukha",
      description: "Scissors gesture - represents lightning, opposition, and separation",
      emoji: "✌️"
    }
  ];

  return (
    <section id="mudras" className="py-24 relative overflow-hidden">
      {/* Background dance image */}
      <div className="absolute inset-0">
        <img 
          src={danceGroup} 
          alt="Indian classical dancers" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-background/95" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Featured Mudras
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore some of the fundamental hand gestures in Bharatiya Natya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mudras.map((mudra, index) => (
            <Card 
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {mudra.emoji}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {mudra.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mudra.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MudraGallery;
