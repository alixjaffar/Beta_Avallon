import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Rocket, Loader2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: string;
  userEmail?: string;
}

export function PricingModal({ open, onOpenChange, currentPlan = 'free', userEmail }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "15 credits/month",
        "1 generated site",
        "Basic customization",
        "No AI agents",
        "Community Support"
      ],
      buttonText: "Current Plan",
      popular: false,
      planId: "free" as const
    },
    {
      name: "Starter",
      price: "$24.99",
      period: "month",
      description: "For creators and small projects",
      features: [
        "100 credits/month",
        "Custom domain hosting",
        "Multi-site creation",
        "1 AI agent",
        "External App integration",
        "Email Support"
      ],
      buttonText: "Upgrade to Starter",
      popular: false,
      planId: "starter" as const
    },
    {
      name: "Growth",
      price: "$39.99",
      period: "month",
      description: "For growing businesses",
      features: [
        "250 credits/month",
        "Everything in Starter",
        "Up to 4 AI agents",
        "Email Hosting",
        "Priority Support",
        "Advanced Analytics"
      ],
      buttonText: "Upgrade to Growth",
      popular: true,
      planId: "growth" as const
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and agencies",
      features: [
        "400+ credits/month",
        "10+ AI employees",
        "Compliance + SLA",
        "Dedicated infrastructure",
        "Custom features",
        "24/7 Priority Support"
      ],
      buttonText: "Contact Us",
      popular: false,
      planId: "enterprise" as const,
      contactEmail: "hello@avallon.ca"
    }
  ];

  const handleUpgrade = async (plan: "starter" | "growth" | "enterprise", interval: "monthly" | "yearly" = "monthly") => {
    if (plan === currentPlan) {
      toast({
        title: "Already on this plan",
        description: `You're already subscribed to the ${plan} plan.`,
      });
      return;
    }

    setLoading(plan);
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      const response = await fetchWithAuth(`${baseUrl}/api/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          interval,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create checkout session' }));
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned. Please check Stripe configuration.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.message || "Stripe is not configured yet.";
      toast({
        title: "Upgrade Unavailable",
        description: errorMessage.includes('not configured') 
          ? "Stripe payment processing is not set up yet. Please contact support or check back later."
          : errorMessage,
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-base">
            Upgrade to unlock more features and scale your web presence
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.planId === currentPlan;
            const isLoading = loading === plan.planId;

            return (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-primary shadow-lg'
                    : 'border'
                } ${
                  isCurrentPlan
                    ? 'bg-muted/50'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period !== "forever" && plan.period !== "pricing" && (
                      <span className="text-muted-foreground text-sm">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-1 text-xs">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="sm"
                    disabled={isCurrentPlan || isLoading}
                    onClick={() => {
                      if (plan.planId === 'enterprise' && (plan as any).contactEmail) {
                        // Open email client for Enterprise plan
                        window.location.href = `mailto:${(plan as any).contactEmail}?subject=Enterprise Plan Inquiry&body=Hello, I'm interested in the Enterprise plan. Please contact me with more information.`;
                      } else if (plan.planId !== 'free') {
                        handleUpgrade(plan.planId as "starter" | "growth" | "enterprise", "monthly");
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        {plan.planId === 'starter' && <Zap className="w-4 h-4 mr-2" />}
                        {plan.planId === 'growth' && <Crown className="w-4 h-4 mr-2" />}
                        {plan.planId === 'enterprise' && <Rocket className="w-4 h-4 mr-2" />}
                        {plan.buttonText}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground mt-6 pt-6 border-t">
          <p>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

