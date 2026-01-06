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
import { Check, Sparkles, Zap, Rocket, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        "3 Websites",
        "1 AI Agent",
        "1 Domain",
        "Basic Support",
        "Community Access"
      ],
      buttonText: "Current Plan",
      popular: false,
      planId: "free" as const
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For growing businesses",
      features: [
        "Unlimited Websites",
        "5 AI Agents",
        "5 Domains",
        "Priority Support",
        "Advanced Analytics",
        "Custom Branding",
        "API Access"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
      planId: "pro" as const
    },
    {
      name: "Business",
      price: "Custom",
      period: "pricing",
      description: "For teams and agencies",
      features: [
        "Unlimited Everything",
        "Unlimited AI Agents",
        "Unlimited Domains",
        "24/7 Priority Support",
        "White-label Options",
        "Team Collaboration",
        "Advanced Security",
        "Dedicated Account Manager"
      ],
      buttonText: "Contact Us",
      popular: false,
      planId: "business" as const,
      contactEmail: "hello@avallon.ca"
    }
  ];

  const handleUpgrade = async (plan: "pro" | "business", interval: "monthly" | "yearly" = "monthly") => {
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
      
      const response = await fetch(`${baseUrl}/api/billing/checkout`, {
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.planId === currentPlan;
            const isLoading = loading === plan.planId;

            return (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 ${
                  plan.popular
                    ? 'border-2 border-primary shadow-lg scale-105'
                    : 'border'
                } ${
                  isCurrentPlan
                    ? 'bg-muted/50'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {isCurrentPlan && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period !== "forever" && plan.period !== "pricing" && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={isCurrentPlan || isLoading}
                    onClick={() => {
                      if (plan.planId === 'business' && (plan as any).contactEmail) {
                        // Open email client for Business plan
                        window.location.href = `mailto:${(plan as any).contactEmail}?subject=Business Plan Inquiry&body=Hello, I'm interested in the Business plan. Please contact me with more information.`;
                      } else if (plan.planId !== 'free') {
                        handleUpgrade(plan.planId, "monthly");
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
                        {plan.buttonText}
                      </>
                    ) : (
                      <>
                        {plan.planId === 'pro' && <Zap className="w-4 h-4 mr-2" />}
                        {plan.planId === 'business' && <Rocket className="w-4 h-4 mr-2" />}
                        {plan.planId === 'free' && <Sparkles className="w-4 h-4 mr-2" />}
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

