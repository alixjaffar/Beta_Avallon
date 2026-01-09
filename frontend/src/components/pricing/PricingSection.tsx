import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "./CardSpotlight";
import { Link } from "react-router-dom";

const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}) => (
  <CardSpotlight className={`h-full ${isPopular ? "border-primary" : "border-border"} border-2`}>
    <div className="relative h-full p-6 flex flex-col">
      {isPopular && (
        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1 w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-medium mb-2 text-foreground">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {price !== "Custom" && <span className="text-muted-foreground">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/auth">
        <Button className="button-gradient w-full">
          Sign Up
        </Button>
      </Link>
    </div>
  </CardSpotlight>
);

export const PricingSection = () => {
  return (
    <section className="container px-4 py-24">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-normal mb-6"
        >
          Choose Your{" "}
          <span className="text-gradient font-medium">Growth Plan</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Select the perfect plan to build, automate, and scale your web presence
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <PricingTier
          name="Free"
          price="$0"
          description="Perfect for getting started"
          features={[
            "15 credits/month",
            "1 generated site",
            "Basic customization",
            "No AI agents",
            "Community support"
          ]}
        />
        <PricingTier
          name="Starter"
          price="$24.99"
          description="For creators and small projects"
          features={[
            "100 credits/month",
            "Custom domain hosting",
            "Multi-site creation",
            "1 AI agent",
            "External App integration"
          ]}
        />
        <PricingTier
          name="Growth"
          price="$39.99"
          description="For growing businesses"
          features={[
            "250 credits/month",
            "Everything in Starter",
            "Up to 4 AI agents",
            "Email Hosting",
            "Priority support"
          ]}
          isPopular
        />
        <PricingTier
          name="Enterprise"
          price="Custom"
          description="For teams and agencies"
          features={[
            "400+ credits/month",
            "10+ AI employees",
            "Compliance + SLA",
            "Dedicated infrastructure",
            "Custom features"
          ]}
        />
      </div>
    </section>
  );
};