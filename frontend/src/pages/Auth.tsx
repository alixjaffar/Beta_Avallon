import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Command, Mail, Calendar, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Skip authentication check - go directly to dashboard
    // In a real app, you'd check for existing session here
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock sign up - validate required fields
    if (!name || !email || !password || !birthday) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      setLoading(false);
      toast({
        title: "Error",
        description: "You must accept the Terms of Service to create an account.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send signup notification to backend
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/signup-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          birthday,
          emailSubscription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process signup');
      }

      const result = await response.json();
      
      setLoading(false);
      toast({
        title: "Success!",
        description: `Welcome ${name}! Account created successfully. Redirecting to beta notification...`,
      });
      navigate("/beta-notification");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Command className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">Avallon</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Create your account to join the Avallon beta waitlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-birthday">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Birthday
                    </Label>
                    <Input
                      id="signup-birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="email-subscription" 
                        checked={emailSubscription}
                        onCheckedChange={(checked) => setEmailSubscription(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="email-subscription"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Subscribe to email notifications
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Get updates about Avallon's development and beta release
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        required
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the Terms of Service
                        </label>
                        <p className="text-xs text-muted-foreground">
                          By creating an account, you agree to our Terms of Service. You acknowledge that Avallon's concept, features, and intellectual property are proprietary and confidential. You agree not to copy, disclose, or attempt to recreate any part of Avallon's platform or business model without explicit written permission from Avallon.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full button-gradient" disabled={loading || !termsAccepted}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
