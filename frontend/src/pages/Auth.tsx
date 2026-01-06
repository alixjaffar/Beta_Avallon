import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Command, Mail, Calendar, User, Github } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { OAuthModal } from "@/components/OAuthModal";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [oauthModalOpen, setOAuthModalOpen] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState<'google' | 'github' | 'apple'>('google');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Restore form state if returning from terms/privacy pages
    const savedState = sessionStorage.getItem('signup_form_state');
    if (savedState) {
      try {
        const formState = JSON.parse(savedState);
        setName(formState.name || '');
        setEmail(formState.email || '');
        setBirthday(formState.birthday || '');
        setPassword(formState.password || '');
        setEmailSubscription(formState.emailSubscription || false);
        setTermsAccepted(formState.termsAccepted || false);
        sessionStorage.removeItem('signup_form_state'); // Clear after restoring
      } catch (e) {
        // Ignore if parsing fails
      }
    }

    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth');
    const provider = params.get('provider');
    const error = params.get('error');

    if (oauthSuccess === 'success' && provider) {
      // OAuth callback successful - user will need to provide info or we extract from URL
      // For now, show a message
      toast({
        title: "OAuth Success",
        description: `Successfully authenticated with ${provider}. Please complete your profile.`,
      });
    }

    if (error) {
      toast({
        title: "OAuth Error",
        description: error === 'oauth_failed' ? 'Failed to authenticate. Please try again.' : error,
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

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
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000'}/api/signup-notification`, {
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
        const errorMessage = errorData.error || 'Failed to process signup';
        
        // If email already registered, show helpful message
        if (response.status === 409 && errorMessage.includes('already registered')) {
          toast({
            title: "Already Registered",
            description: "This email is already registered. Please log in instead.",
            variant: "destructive",
          });
          // Switch to login tab
          setTimeout(() => {
            setIsLogin(true);
          }, 1000);
          setLoading(false);
          return;
        }
        
        throw new Error(errorMessage);
      }

          const result = await response.json();

          // Store a lightweight demo session for dashboard access
          try {
            localStorage.setItem("avallon_session", JSON.stringify({ email, name, ts: Date.now() }));
          } catch (_) {}

          setLoading(false);
          toast({
            title: "Success!",
            description: `Welcome ${name}! Your AI agent is being set up...`,
          });
          navigate("/dashboard");
          
          // Onboard user asynchronously (fire and forget - don't block navigation)
          // Use the same password for n8n account
          (async () => {
          try {
            const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
            const onboardResponse = await fetch(`${baseUrl}/api/users/onboard`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': email, // Pass email for user identification
              },
              body: JSON.stringify({ 
                email,
                password: password // Pass password to use for n8n account
              }),
            });
            
            if (onboardResponse.ok) {
              const onboardData = await onboardResponse.json();
              if (!onboardData.skip) {
                console.log('✅ User onboarded with n8n agent:', onboardData.agent);
              }
            } else {
              console.warn('⚠️ Onboarding failed, but signup succeeded');
            }
          } catch (onboardError) {
            console.error('Onboarding error (non-blocking):', onboardError);
            // Don't block signup if onboarding fails
          }
          })();
    } catch (error: any) {
      setLoading(false);
      console.error('Signup error:', error);
      const errorMessage = error?.message || error?.error || 'Failed to create account. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Try Supabase auth first
      // In mock mode, this resolves instantly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to mock login if Supabase is not configured
        if (error.message.includes('mock') || !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('mock')) {
          // Mock login for demo - instant login, no waiting
          localStorage.setItem("avallon_session", JSON.stringify({ email, name: email.split('@')[0], ts: Date.now() }));
          
          // Navigate immediately - don't wait for anything
          navigate("/dashboard");
          
          // Show toast after navigation (non-blocking)
          setTimeout(() => {
            toast({
              title: "Success!",
              description: "Welcome back!",
            });
          }, 100);
          
          setLoading(false);
          
          // Ensure user is onboarded asynchronously (fire and forget - don't block navigation)
          (async () => {
          try {
            const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
            await fetch(`${baseUrl}/api/users/onboard`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-email': email, // Pass email for user identification
              },
              body: JSON.stringify({ email }), // Also in body for explicit identification
            });
          } catch (onboardError) {
            console.error('Onboarding error (non-blocking):', onboardError);
          }
          })();
          return;
        }
        throw error;
      }

      if (data?.user) {
        localStorage.setItem("avallon_session", JSON.stringify({ 
          email: data.user.email || email, 
          name: data.user.user_metadata?.name || email.split('@')[0], 
          ts: Date.now() 
        }));
        
        // Navigate immediately - don't wait for toast or anything else
        navigate("/dashboard");
        
        // Show toast after navigation (non-blocking)
        setTimeout(() => {
          toast({
            title: "Success!",
            description: "Welcome back!",
          });
        }, 100);
        
        setLoading(false);
        
        // Ensure user is onboarded asynchronously (fire and forget - don't block navigation)
        (async () => {
        try {
          const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
          const userEmail = data.user.email || email;
          await fetch(`${baseUrl}/api/users/onboard`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-email': userEmail, // Pass email for user identification
            },
            body: JSON.stringify({ email: userEmail }), // Also in body for explicit identification
          });
        } catch (onboardError) {
          console.error('Onboarding error (non-blocking):', onboardError);
        }
        })();
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'apple') => {
    // Check if Supabase is in mock mode or not configured
    const isMockMode = !import.meta.env.VITE_SUPABASE_URL || 
                       import.meta.env.VITE_SUPABASE_URL.includes('mock') ||
                       import.meta.env.VITE_SUPABASE_URL === 'https://mock.supabase.co';
    
    if (isMockMode) {
      // Show professional OAuth modal instead of browser prompts
      setOAuthProvider(provider);
      setOAuthModalOpen(true);
      return;
    }

    // Try real Supabase OAuth (only if not in mock mode)
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth?oauth=callback&provider=${provider}`,
        },
      });

      if (error) {
        throw error;
      }

      // If OAuth redirect was initiated, the page will redirect
      // Handle the callback in useEffect
    } catch (error: any) {
      setLoading(false);
      // Fallback to modal if OAuth fails
      setOAuthProvider(provider);
      setOAuthModalOpen(true);
    }
  };

  const handleOAuthSuccess = async (userEmail: string, userName: string) => {
    setLoading(true);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
    const providerNames = { google: 'Google', github: 'GitHub', apple: 'Apple' };

    try {
      // Store session with user-provided info
      const sessionData = {
        email: userEmail,
        name: userName,
        provider: oauthProvider,
        ts: Date.now()
      };
      
      localStorage.setItem("avallon_session", JSON.stringify(sessionData));
      
      // Send to backend to create session cookie
      try {
        await fetch(`${baseUrl}/api/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: oauthProvider,
            email: userEmail,
            name: userName,
          }),
        });
      } catch (err) {
        console.error('Failed to create backend session:', err);
      }

      // Onboard user (create n8n agent)
      try {
        await fetch(`${baseUrl}/api/users/onboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
          },
          body: JSON.stringify({ email: userEmail }),
        });
      } catch (onboardError) {
        console.error('Onboarding error (non-blocking):', onboardError);
      }

      setLoading(false);
      toast({
        title: "Success!",
        description: `Logged in with ${providerNames[oauthProvider]}! Your account is being set up...`,
      });
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to complete sign in. Please try again.",
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
              {isLogin ? "Sign in to your account" : "Create your account to join the Avallon beta waitlist"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="w-full" onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Log In</TabsTrigger>
              </TabsList>

              {/* Social Login Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                >
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

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
                          I agree to the{" "}
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm font-medium underline"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              // Store current form state before navigating
                              const formState = { name, email, birthday, password, emailSubscription, termsAccepted };
                              sessionStorage.setItem('signup_form_state', JSON.stringify(formState));
                              navigate("/terms");
                            }}
                          >
                            Terms of Service
                          </Button>{" "}
                          and{" "}
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm font-medium underline"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              // Store current form state before navigating
                              const formState = { name, email, birthday, password, emailSubscription, termsAccepted };
                              sessionStorage.setItem('signup_form_state', JSON.stringify(formState));
                              navigate("/privacy");
                            }}
                          >
                            Privacy Policy
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          By creating an account, you agree to our Terms of Service and Privacy Policy. 
                          You acknowledge that Avallon's concept, features, and intellectual property are 
                          proprietary and confidential. You agree not to copy, disclose, or attempt to recreate 
                          any part of Avallon's platform or business model without explicit written permission from Avallon.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full button-gradient" disabled={loading || !termsAccepted}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full button-gradient" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
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

      {/* OAuth Modal */}
      <OAuthModal
        open={oauthModalOpen}
        onOpenChange={setOAuthModalOpen}
        provider={oauthProvider}
        onSuccess={handleOAuthSuccess}
      />
    </div>
  );
};

export default Auth;
