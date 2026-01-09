import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Command, Mail, Calendar, User, Github, Eye, EyeOff, Lock, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { OAuthModal } from "@/components/OAuthModal";

// Local password validation (doesn't need Firebase)
function validatePasswordLocal(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character';
  return null;
}

function validateEmailLocal(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
}

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [oauthModalOpen, setOAuthModalOpen] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState<'google' | 'github'>('google');
  
  // Password strength indicators
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if we have a generate prompt from landing page
  const generatePrompt = (location.state as { generatePrompt?: string })?.generatePrompt;

  // Check if user is already logged in
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const checkAuth = async () => {
      try {
        // First check localStorage
        const sessionData = localStorage.getItem('avallon_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.email) {
            navigate("/dashboard");
            return;
          }
        }
        
        // Then try Firebase (lazy import)
        const { onAuthChange } = await import('@/lib/firebase');
        unsubscribe = onAuthChange((user) => {
          if (user) {
            navigate("/dashboard");
          }
        });
      } catch (error) {
        console.warn('Firebase not available for auth check');
      }
    };
    
    checkAuth();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  // Update password strength indicators
  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [password]);

    // Restore form state if returning from terms/privacy pages
  useEffect(() => {
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
        sessionStorage.removeItem('signup_form_state');
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all required fields
    if (!name || !email || !password || !birthday) {
      setLoading(false);
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    const emailError = validateEmailLocal(email);
    if (emailError) {
      setLoading(false);
      toast({
        title: "Invalid Email",
        description: emailError,
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    const passwordError = validatePasswordLocal(password);
    if (passwordError) {
      setLoading(false);
      toast({
        title: "Weak Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setLoading(false);
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setLoading(false);
      toast({
        title: "Terms Required",
        description: "You must accept the Terms of Service to create an account.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Register with Firebase (lazy import)
      const { registerUser } = await import('@/lib/firebase');
      const result = await registerUser(email, password, name);
      
      if (result.error) {
        setLoading(false);
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      // Get Firebase token for backend
      const user = result.user!;
      const token = await user.getIdToken();

      // Store session with Firebase token
      localStorage.setItem("avallon_session", JSON.stringify({ 
        email, 
        name, 
        ts: Date.now(),
        uid: user.uid 
      }));
      localStorage.setItem("firebase_token", token);

      // Send signup notification to backend
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      
      try {
        await fetch(`${baseUrl}/api/signup-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          birthday,
          emailSubscription,
            firebaseUid: user.uid,
        }),
      });
      } catch (err) {
        console.error('Signup notification error:', err);
      }

          setLoading(false);
          toast({
        title: "Account Created! 🎉",
        description: `Welcome ${name}! Please check your email to verify your account.`,
          });
      
      // Navigate to dashboard, passing along any generate prompt
      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
          navigate("/dashboard");
      }
          
      // Onboard user asynchronously
          (async () => {
          try {
          await fetch(`${baseUrl}/api/users/onboard`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-user-email': email,
              },
              body: JSON.stringify({ 
                email,
              firebaseUid: user.uid,
              }),
            });
          } catch (onboardError) {
            console.error('Onboarding error (non-blocking):', onboardError);
          }
          })();

    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || 'Failed to create account. Please try again.',
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
        title: "Missing Information",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Login with Firebase (lazy import)
      const { loginUser } = await import('@/lib/firebase');
      const result = await loginUser(email, password);
      
      if (result.error) {
        setLoading(false);
            toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        });
          return;
      }

      const user = result.user!;
      const token = result.token!;

      // Store session with Firebase token
        localStorage.setItem("avallon_session", JSON.stringify({ 
        email: user.email || email, 
        name: user.displayName || email.split('@')[0], 
        ts: Date.now(),
        uid: user.uid 
      }));
      localStorage.setItem("firebase_token", token);

      // Navigate to dashboard, passing along any generate prompt
      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
        navigate("/dashboard");
      }
        
          toast({
        title: "Welcome Back! 👋",
        description: `Signed in as ${user.email}`,
          });
        
        setLoading(false);
        
      // Ensure user is onboarded
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
        (async () => {
        try {
          await fetch(`${baseUrl}/api/users/onboard`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-user-email': user.email || email,
            },
            body: JSON.stringify({ 
              email: user.email || email,
              firebaseUid: user.uid,
            }),
          });
        } catch (onboardError) {
          console.error('Onboarding error (non-blocking):', onboardError);
        }
        })();

    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!forgotPasswordEmail) {
      setLoading(false);
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const emailError = validateEmailLocal(forgotPasswordEmail);
    if (emailError) {
      setLoading(false);
      toast({
        title: "Invalid Email",
        description: emailError,
        variant: "destructive",
      });
      return;
    }

    try {
      // Reset password with Firebase (lazy import)
      const { resetPassword } = await import('@/lib/firebase');
      const result = await resetPassword(forgotPasswordEmail);
      
      if (result.error) {
        setLoading(false);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
      });
        return;
      }

      setLoading(false);
      setForgotPasswordSent(true);
      toast({
        title: "Email Sent! 📧",
        description: "Check your inbox for password reset instructions.",
      });

    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
    const providerNames = { google: 'Google', github: 'GitHub' };

    try {
      // Import Firebase OAuth functions dynamically
      const { signInWithGoogle, signInWithGithub } = await import('@/lib/firebase');
      
      // Call the appropriate sign-in function
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithGithub();
      
      if (result.error) {
        setLoading(false);
        toast({
          title: `${providerNames[provider]} Sign-In Failed`,
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      const user = result.user!;
      const token = result.token!;

      // Store session
      const sessionData = {
        email: user.email,
        name: user.displayName || user.email?.split('@')[0],
        provider: provider,
        uid: user.uid,
        photoURL: user.photoURL,
        ts: Date.now()
      };
      
      localStorage.setItem("avallon_session", JSON.stringify(sessionData));
      localStorage.setItem("firebase_token", token);

      // Onboard user
      try {
        await fetch(`${baseUrl}/api/users/onboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-user-email': user.email || '',
          },
          body: JSON.stringify({ 
            email: user.email,
            firebaseUid: user.uid 
          }),
        });
      } catch (onboardError) {
        console.error('Onboarding error (non-blocking):', onboardError);
      }

      setLoading(false);
      toast({
        title: "Success! 🎉",
        description: `Signed in with ${providerNames[provider]}!`,
      });
      
      // Navigate to dashboard, passing along any generate prompt
      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
      navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Social login error:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to complete sign in. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Legacy OAuth modal handler (keeping for compatibility)
  const handleOAuthSuccess = async (userEmail: string, userName: string) => {
    // This is now handled directly by handleSocialLogin
    console.warn('handleOAuthSuccess is deprecated, use handleSocialLogin directly');
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => (
    <div className="mt-2 space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Password must have:</p>
      <div className="grid grid-cols-2 gap-1">
        {[
          { key: 'length', label: '8+ characters' },
          { key: 'uppercase', label: 'Uppercase (A-Z)' },
          { key: 'lowercase', label: 'Lowercase (a-z)' },
          { key: 'number', label: 'Number (0-9)' },
          { key: 'special', label: 'Special (!@#$...)' },
        ].map(({ key, label }) => (
          <div 
            key={key} 
            className={`flex items-center gap-1.5 text-xs ${
              passwordChecks[key as keyof typeof passwordChecks] 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-muted-foreground'
            }`}
          >
            {passwordChecks[key as keyof typeof passwordChecks] ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {label}
          </div>
        ))}
      </div>
    </div>
  );

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <Command className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">Avallon</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Reset Password
              </CardTitle>
              <CardDescription>
                {forgotPasswordSent 
                  ? "Check your email for reset instructions" 
                  : "Enter your email to receive a password reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forgotPasswordSent ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Check Your Email</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      We've sent password reset instructions to:
                    </p>
                    <p className="font-medium text-primary mt-1">{forgotPasswordEmail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setForgotPasswordSent(false);
                        setForgotPasswordEmail("");
                      }}
                    >
                      Try Another Email
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordSent(false);
                        setForgotPasswordEmail("");
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordSent(false);
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              {isLogin ? "Sign in to your account" : "Create your account to get started"}
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
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
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
                    <Label htmlFor="signup-password">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Password
                    </Label>
                    <div className="relative">
                    <Input
                      id="signup-password"
                        type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && <PasswordStrengthIndicator />}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`pr-10 ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Passwords do not match
                      </p>
                    )}
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
                          Get updates about new features and tips
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
                              const formState = { name, email, birthday, password, emailSubscription, termsAccepted };
                              sessionStorage.setItem('signup_form_state', JSON.stringify(formState));
                              navigate("/privacy");
                            }}
                          >
                            Privacy Policy
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full button-gradient" 
                    disabled={loading || !termsAccepted || password !== confirmPassword}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Password
                      </Label>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs"
                        type="button"
                        onClick={() => {
                          setForgotPasswordEmail(email);
                          setShowForgotPassword(true);
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                    <Input
                      id="login-password"
                        type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                        className="pr-10"
                    />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full button-gradient" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
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
