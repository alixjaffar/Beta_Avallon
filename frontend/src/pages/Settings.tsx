import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import avallonLogo from "@/assets/avallon-logo.png";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { 
  ArrowLeft, 
  CreditCard, 
  Crown, 
  Zap, 
  Rocket, 
  LogOut,
  AlertTriangle,
  Check,
  Loader2,
  Settings as SettingsIcon
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
}

const Settings = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [credits, setCredits] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beta-avallon.onrender.com' 
    : 'http://localhost:3000';

  useEffect(() => {
    loadSubscription();
    loadCredits();
  }, []);

  const loadSubscription = async () => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/plan`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/credits`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/subscription/cancel`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Subscription Cancelled",
          description: data.message,
        });
        loadSubscription();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to cancel subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleUpgrade = async (plan: 'starter' | 'growth') => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval: 'monthly' }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start checkout",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'starter': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'growth': return <Crown className="w-5 h-5 text-purple-500" />;
      case 'enterprise': return <Rocket className="w-5 h-5 text-orange-500" />;
      default: return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-500';
      case 'growth': return 'bg-purple-500';
      case 'enterprise': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case 'starter': return '$24.99/mo';
      case 'growth': return '$39.99/mo';
      case 'enterprise': return 'Custom';
      default: return 'Free';
    }
  };

  const getPlanCredits = (plan: string) => {
    switch (plan) {
      case 'starter': return 100;
      case 'growth': return 250;
      case 'enterprise': return 400;
      default: return 5;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
          </div>
          <ThemeToggleButton />
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPlanIcon(subscription?.plan || 'free')}
              Current Plan
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${getPlanColor(subscription?.plan || 'free')} flex items-center justify-center`}>
                  {getPlanIcon(subscription?.plan || 'free')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold capitalize">{subscription?.plan || 'Free'} Plan</h3>
                  <p className="text-sm text-muted-foreground">{getPlanPrice(subscription?.plan || 'free')}</p>
                </div>
              </div>
              <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
                {subscription?.status || 'Active'}
              </Badge>
            </div>

            {/* Credits */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Credits</h4>
                  <p className="text-sm text-muted-foreground">
                    {getPlanCredits(subscription?.plan || 'free')} credits/month with your plan
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{credits}</span>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
              </div>
            </div>

            {/* Plan Period */}
            {subscription?.currentPeriodEnd && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Billing Period</h4>
                    <p className="text-sm text-muted-foreground">Your next billing date</p>
                  </div>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {subscription?.plan === 'free' && (
                <>
                  <Button 
                    onClick={() => handleUpgrade('starter')}
                    className="flex-1"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Starter ($24.99/mo)
                  </Button>
                  <Button 
                    onClick={() => handleUpgrade('growth')}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Growth ($39.99/mo)
                  </Button>
                </>
              )}
              
              {subscription?.plan === 'starter' && (
                <Button 
                  onClick={() => handleUpgrade('growth')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Growth ($39.99/mo)
                </Button>
              )}

              {subscription?.plan && subscription.plan !== 'free' && subscription.status === 'active' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Cancel Subscription?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your {subscription.plan} subscription? 
                        You'll lose access to:
                        <ul className="mt-2 space-y-1 list-disc list-inside">
                          {subscription.plan === 'growth' && (
                            <>
                              <li>Email Hosting</li>
                              <li>4 AI Agents</li>
                              <li>250 credits/month</li>
                            </>
                          )}
                          {subscription.plan === 'starter' && (
                            <>
                              <li>AI Agents</li>
                              <li>External App Integrations</li>
                              <li>100 credits/month</li>
                            </>
                          )}
                        </ul>
                        <p className="mt-2">You'll be downgraded to the Free plan with 15 credits/month.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancelSubscription}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={cancelling}
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Yes, Cancel'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <CardDescription>See what each plan offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Free */}
              <div className={`p-4 rounded-lg border ${subscription?.plan === 'free' ? 'border-primary bg-primary/5' : ''}`}>
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Free
                  {subscription?.plan === 'free' && <Badge variant="secondary" className="text-xs">Current</Badge>}
                </h4>
                <p className="text-2xl font-bold mt-2">$0<span className="text-sm font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 15 credits/month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 website</li>
                  <li className="flex items-center gap-2 text-muted-foreground">✗ AI Agents</li>
                  <li className="flex items-center gap-2 text-muted-foreground">✗ Integrations</li>
                  <li className="flex items-center gap-2 text-muted-foreground">✗ Email Hosting</li>
                </ul>
              </div>

              {/* Starter */}
              <div className={`p-4 rounded-lg border ${subscription?.plan === 'starter' ? 'border-primary bg-primary/5' : ''}`}>
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Starter
                  {subscription?.plan === 'starter' && <Badge variant="secondary" className="text-xs">Current</Badge>}
                </h4>
                <p className="text-2xl font-bold mt-2">$24.99<span className="text-sm font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 100 credits/month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Multi-site creation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 AI Agent</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Integrations</li>
                  <li className="flex items-center gap-2 text-muted-foreground">✗ Email Hosting</li>
                </ul>
              </div>

              {/* Growth */}
              <div className={`p-4 rounded-lg border-2 ${subscription?.plan === 'growth' ? 'border-primary bg-primary/5' : 'border-purple-500'}`}>
                <h4 className="font-semibold flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  Growth
                  {subscription?.plan === 'growth' ? (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  ) : (
                    <Badge className="bg-purple-500 text-xs">Popular</Badge>
                  )}
                </h4>
                <p className="text-2xl font-bold mt-2">$39.99<span className="text-sm font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 250 credits/month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 4 AI Agents</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Email Hosting</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;

