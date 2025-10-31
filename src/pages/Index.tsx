import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechnologySection from "@/components/TechnologySection";
import DemoSection from "@/components/DemoSection";
import MudraGallery from "@/components/MudraGallery";
import Footer from "@/components/Footer";
import HandGestureDetector from "@/components/HandGestureDetector";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <TechnologySection />
      <DemoSection />
      <MudraGallery />
      <Footer />
    </div>
  );
};

export default Index;
