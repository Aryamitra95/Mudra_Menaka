const TechnologySection = () => {
  const technologies = [
    { name: "MediaPipe", icon: "🤲" },
    { name: "TensorFlow", icon: "🧠" },
    { name: "Python", icon: "🐍" },
    { name: "React", icon: "⚛️" },
    { name: "OpenCV", icon: "👁️" },
    { name: "Neural Networks", icon: "🕸️" }
  ];

  return (
    <section id="technology" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Powered by Advanced Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with cutting-edge machine learning frameworks and computer vision libraries
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-4xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                {tech.icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
