import { motion } from "framer-motion";
import { ArrowRight, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import LogoCarousel from "@/components/LogoCarousel";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import MissionSection from "@/components/MissionSection";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative container px-4 pt-40 pb-20"
      >
        {/* Background */}
        <div 
          className="absolute inset-0 -z-10 bg-background"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glass"
        >
          <span className="text-sm font-medium">
            <Command className="w-4 h-4 inline-block mr-2" />
            Welcome to your Web Creation Hub
          </span>
        </motion.div>
        
        <div className="max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
            <span className="text-muted-foreground">
              <TextGenerateEffect words="Create. Automate." />
            </span>
            <br />
            <span className="text-foreground font-medium">
              <TextGenerateEffect words="Own your web." />
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-left"
          >
            Build, automate, and scale your web presence from one unified platform.{" "}
            <span className="text-foreground">Launch your web presence in minutes.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Link to="/auth">
              <Button size="lg" className="button-gradient">
                Sign Up
              </Button>
            </Link>
            <Button size="lg" variant="link" className="text-foreground">
              View Templates <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mx-auto max-w-6xl mt-20"
        >
          <div className="glass rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={mounted && theme === "dark" ? "/lovable-uploads/Hero_Dark.png" : "/lovable-uploads/Hero_Light.png"}
              alt="Avallon Dashboard - Web Creation Hub"
              className="w-full h-auto rounded-xl"
              onError={(e) => {
                // Fallback to the original images if Hero images don't exist
                const target = e.target as HTMLImageElement;
                if (target.src.includes('Hero_Dark.png')) {
                  target.src = '/lovable-uploads/bf56a0c6-48e4-49f7-b286-8e3fda9a3385.png';
                } else if (target.src.includes('Hero_Light.png')) {
                  target.src = '/lovable-uploads/c32c6788-5e4a-4fee-afee-604b03113c7f.png';
                }
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl pointer-events-none" />
        </motion.div>
      </motion.section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Features Section */}
      <div id="features" className="bg-background">
        <FeaturesSection />
      </div>

      {/* Mission Section */}
      <MissionSection />

      {/* Pricing Section */}
      <div id="pricing" className="bg-background">
        <PricingSection />
      </div>

      {/* Testimonials Section */}
      <div className="bg-background">
        <TestimonialsSection />
      </div>

      {/* CTA Section */}
      <section className="container px-4 py-20 relative bg-background">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("/lovable-uploads/a2c0bb3a-a47b-40bf-ba26-d79f2f9e741b.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0A0A0A]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12 text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your web presence?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have already transformed their ideas into reality with our platform.
          </p>
          <Link to="/auth">
            <Button size="lg" className="button-gradient">
              Sign Up
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="bg-background">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
