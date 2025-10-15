import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import { useState } from "react";
import mudraHands from "@/assets/mudra-hands.jpg";

const DemoSection = () => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Try Our Prototype
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload an image or use your camera to identify mudras in real-time
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card/50 backdrop-blur-sm border-border p-8 md:p-12">
          <div className="space-y-8">
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/60 transition-colors bg-gradient-to-br from-primary/5 to-secondary/5">
              {uploadedFile ? (
                <div className="space-y-4">
                  <img 
                    src={uploadedFile} 
                    alt="Uploaded" 
                    className="max-h-96 mx-auto rounded-lg shadow-lg"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => setUploadedFile(null)}
                    className="border-primary/50"
                  >
                    Clear Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Upload className="h-12 w-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-foreground">Upload Your Image</h3>
                    <p className="text-muted-foreground">
                      Drag and drop or click to select an image of a mudra
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button 
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Use Camera for Real-time Detection
            </Button>

            {uploadedFile && (
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                size="lg"
              >
                Identify Mudra
              </Button>
            )}
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Note: This is a prototype demonstration. Actual ML model integration would be implemented in production.
        </p>
      </div>
    </section>
  );
};

export default DemoSection;
