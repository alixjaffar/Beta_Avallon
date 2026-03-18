import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Mail, Calendar, User, Github, Eye, EyeOff, Lock, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import HeroWave from "@/components/ui/dynamic-wave-canvas-background";

// Color palette
const colors = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#a1a1aa",
  300: "#71717a",
  400: "#52525b",
  500: "#3f3f46",
  600: "#27272a",
  700: "#18181b",
  800: "#0f0f10",
  900: "#09090b",
};

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
  const [showAdminMode, setShowAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('avallon_admin_email') || '';
    }
    return '';
  });
  const [targetEmail, setTargetEmail] = useState("");
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

  const generatePrompt = (location.state as { generatePrompt?: string })?.generatePrompt;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('admin') === 'true') {
      setShowAdminMode(true);
    }
  }, [location.search]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const checkAuth = async () => {
      try {
        const sessionData = localStorage.getItem('avallon_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.email) {
            navigate("/dashboard");
            return;
          }
        }
        
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

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  }, [password]);

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
      } catch (e) {}
    }
  }, []);

  const handleAdminImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const effectiveAdminEmail = adminEmail || localStorage.getItem('avallon_admin_email') || '';
    
    if (!effectiveAdminEmail) {
      setLoading(false);
      toast({ title: "Admin Email Required", description: "Please enter your admin email.", variant: "destructive" });
      return;
    }

    if (!targetEmail) {
      setLoading(false);
      toast({ title: "Missing Information", description: "Please enter the user email.", variant: "destructive" });
      return;
    }

    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/auth/admin-impersonate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: effectiveAdminEmail, targetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        toast({ title: "Impersonation Failed", description: data.error || 'Failed to impersonate user', variant: "destructive" });
        return;
      }

      localStorage.setItem('avallon_admin_email', effectiveAdminEmail);
      localStorage.setItem("avallon_session", JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        ts: Date.now(),
        isImpersonated: true,
        impersonatedBy: effectiveAdminEmail,
      }));

      setLoading(false);
      toast({ title: "Admin Access Granted", description: `Logged in as ${targetEmail}` });
      setTargetEmail("");
      navigate("/dashboard");

    } catch (error: any) {
      setLoading(false);
      toast({ title: "Error", description: error?.message || "Failed to impersonate user.", variant: "destructive" });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !birthday) {
      setLoading(false);
      toast({ title: "Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const emailError = validateEmailLocal(email);
    if (emailError) {
      setLoading(false);
      toast({ title: "Invalid Email", description: emailError, variant: "destructive" });
      return;
    }

    const passwordError = validatePasswordLocal(password);
    if (passwordError) {
      setLoading(false);
      toast({ title: "Weak Password", description: passwordError, variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      toast({ title: "Passwords Don't Match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    if (!termsAccepted) {
      setLoading(false);
      toast({ title: "Terms Required", description: "You must accept the Terms of Service.", variant: "destructive" });
      return;
    }

    try {
      const { registerUser } = await import('@/lib/firebase');
      const result = await registerUser(email, password, name);
      
      if (result.error) {
        setLoading(false);
        toast({ title: "Registration Failed", description: result.error, variant: "destructive" });
        return;
      }

      const user = result.user!;
      const token = await user.getIdToken();

      localStorage.setItem("avallon_session", JSON.stringify({ email, name, ts: Date.now(), uid: user.uid }));
      localStorage.setItem("firebase_token", token);

      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      
      try {
        await fetch(`${baseUrl}/api/signup-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name, email, birthday, emailSubscription, firebaseUid: user.uid }),
        });
      } catch (err) {
        console.error('Signup notification error:', err);
      }

      setLoading(false);
      toast({ title: "Account Created!", description: `Welcome ${name}!` });
      
      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
        navigate("/dashboard");
      }
          
      (async () => {
        try {
          await fetch(`${baseUrl}/api/users/onboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-user-email': email },
            body: JSON.stringify({ email, firebaseUid: user.uid }),
          });
        } catch (onboardError) {
          console.error('Onboarding error:', onboardError);
        }
      })();

    } catch (error: any) {
      setLoading(false);
      toast({ title: "Error", description: error?.message || 'Failed to create account.', variant: "destructive" });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      toast({ title: "Missing Information", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }

    try {
      const { loginUser } = await import('@/lib/firebase');
      const result = await loginUser(email, password);
      
      if (result.error) {
        setLoading(false);
        toast({ title: "Login Failed", description: result.error, variant: "destructive" });
        return;
      }

      const user = result.user!;
      const token = result.token!;

      localStorage.setItem("avallon_session", JSON.stringify({ 
        email: user.email || email, 
        name: user.displayName || email.split('@')[0], 
        ts: Date.now(),
        uid: user.uid 
      }));
      localStorage.setItem("firebase_token", token);

      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
        navigate("/dashboard");
      }
        
      toast({ title: "Welcome Back!", description: `Signed in as ${user.email}` });
      setLoading(false);
        
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      (async () => {
        try {
          await fetch(`${baseUrl}/api/users/onboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-user-email': user.email || email },
            body: JSON.stringify({ email: user.email || email, firebaseUid: user.uid }),
          });
        } catch (onboardError) {
          console.error('Onboarding error:', onboardError);
        }
      })();

    } catch (error: any) {
      setLoading(false);
      toast({ title: "Error", description: error?.message || "Failed to log in.", variant: "destructive" });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!forgotPasswordEmail) {
      setLoading(false);
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }

    const emailError = validateEmailLocal(forgotPasswordEmail);
    if (emailError) {
      setLoading(false);
      toast({ title: "Invalid Email", description: emailError, variant: "destructive" });
      return;
    }

    try {
      const { resetPassword } = await import('@/lib/firebase');
      const result = await resetPassword(forgotPasswordEmail);
      
      if (result.error) {
        setLoading(false);
        toast({ title: "Error", description: result.error, variant: "destructive" });
        return;
      }

      setLoading(false);
      setForgotPasswordSent(true);
      toast({ title: "Email Sent!", description: "Check your inbox for reset instructions." });

    } catch (error: any) {
      setLoading(false);
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';

    try {
      const { signInWithGoogle, signInWithGithub } = await import('@/lib/firebase');
      
      const result = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithGithub();
      
      if (result.error) {
        setLoading(false);
        toast({ title: `${provider} Sign-In Failed`, description: result.error, variant: "destructive" });
        return;
      }

      const user = result.user!;
      const token = result.token!;

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

      try {
        await fetch(`${baseUrl}/api/users/onboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-user-email': user.email || '' },
          body: JSON.stringify({ email: user.email, firebaseUid: user.uid }),
        });
      } catch (onboardError) {
        console.error('Onboarding error:', onboardError);
      }

      setLoading(false);
      toast({ title: "Success!", description: `Signed in with ${provider}!` });
      
      if (generatePrompt) {
        navigate("/dashboard", { state: { generatePrompt } });
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setLoading(false);
      toast({ title: "Error", description: error?.message || "Failed to sign in.", variant: "destructive" });
    }
  };

  const PasswordStrengthIndicator = () => (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium" style={{ color: colors[300] }}>Password must have:</p>
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
            className="flex items-center gap-1.5 text-xs"
            style={{ color: passwordChecks[key as keyof typeof passwordChecks] ? '#4ade80' : colors[400] }}
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

  const inputStyle = {
    background: colors[800],
    border: `1px solid ${colors[600]}`,
    color: colors[100],
  };

  // Admin Mode View
  if (showAdminMode) {
    const hasStoredAdminEmail = !!localStorage.getItem('avallon_admin_email');
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: colors[900] }}>
        <div className="fixed inset-0 z-0"><HeroWave /></div>
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="text-2xl font-bold tracking-tight block text-center mb-8" style={{ color: colors[50] }}>Avallon</Link>

          <div className="rounded-xl p-6" style={{ background: `${colors[800]}ee`, border: `2px solid rgb(239, 68, 68)`, backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-medium text-red-500">Admin Mode</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: colors[300] }}>Enter any user's email to access their account</p>

            <form onSubmit={handleAdminImpersonate} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: colors[100] }}>User Email</label>
                <input
                  type="email"
                  placeholder="Enter user email..."
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  style={inputStyle}
                />
              </div>
              
              {!hasStoredAdminEmail && (
                <div>
                  <label className="text-sm mb-2 block" style={{ color: colors[300] }}>Your Admin Email</label>
                  <input
                    type="email"
                    placeholder="alij123402@gmail.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    style={inputStyle}
                  />
                </div>
              )}
              
              {hasStoredAdminEmail && (
                <p className="text-xs" style={{ color: colors[400] }}>
                  Admin: {localStorage.getItem('avallon_admin_email')}
                  <button type="button" className="ml-2 underline text-red-400" onClick={() => { localStorage.removeItem('avallon_admin_email'); setAdminEmail(''); }}>Change</button>
                </p>
              )}
              
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Access Account"}
              </button>
            </form>
          </div>

          <button onClick={() => { setShowAdminMode(false); navigate("/auth"); }} className="mt-6 flex items-center gap-2 mx-auto text-sm" style={{ color: colors[300] }}>
            <ArrowLeft className="w-4 h-4" /> Back to Normal Login
          </button>
        </div>
      </div>
    );
  }

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: colors[900] }}>
        <div className="fixed inset-0 z-0"><HeroWave /></div>
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="text-2xl font-bold tracking-tight block text-center mb-8" style={{ color: colors[50] }}>Avallon</Link>

          <div className="rounded-xl p-6" style={{ background: `${colors[800]}ee`, border: `1px solid ${colors[600]}`, backdropFilter: 'blur(12px)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5" style={{ color: colors[200] }} />
              <h2 className="text-lg font-medium" style={{ color: colors[50] }}>Reset Password</h2>
            </div>
            <p className="text-sm mb-6" style={{ color: colors[300] }}>
              {forgotPasswordSent ? "Check your email for reset instructions" : "Enter your email to receive a password reset link"}
            </p>

            {forgotPasswordSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm" style={{ color: colors[300] }}>We've sent instructions to:</p>
                <p className="font-medium" style={{ color: colors[100] }}>{forgotPasswordEmail}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setForgotPasswordSent(false); setForgotPasswordEmail(""); }} className="flex-1 py-2 rounded-lg text-sm" style={{ border: `1px solid ${colors[600]}`, color: colors[200] }}>
                    Try Another Email
                  </button>
                  <button onClick={() => { setShowForgotPassword(false); setForgotPasswordSent(false); }} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ background: colors[100], color: colors[900] }}>
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors[100] }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                    style={inputStyle}
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ background: colors[100], color: colors[900] }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>

          <button onClick={() => { setShowForgotPassword(false); setForgotPasswordSent(false); }} className="mt-6 flex items-center gap-2 mx-auto text-sm" style={{ color: colors[300] }}>
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Main Auth View
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: colors[900] }}>
      <div className="fixed inset-0 z-0"><HeroWave /></div>
      
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="text-2xl font-bold tracking-tight block text-center mb-8" style={{ color: colors[50] }}>Avallon</Link>

        <div className="rounded-xl p-6" style={{ background: `${colors[800]}ee`, border: `1px solid ${colors[600]}`, backdropFilter: 'blur(12px)' }}>
          <h2 className="text-xl font-medium mb-1" style={{ color: colors[50] }}>Welcome</h2>
          <p className="text-sm mb-6" style={{ color: colors[300] }}>
            {isLogin ? "Sign in to your account" : "Create your account to get started"}
          </p>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg mb-6" style={{ background: colors[700] }}>
            <button onClick={() => setIsLogin(false)} className="flex-1 py-2 text-sm font-medium rounded-md transition-all" style={{ background: !isLogin ? colors[600] : 'transparent', color: !isLogin ? colors[50] : colors[300] }}>
              Sign Up
            </button>
            <button onClick={() => setIsLogin(true)} className="flex-1 py-2 text-sm font-medium rounded-md transition-all" style={{ background: isLogin ? colors[600] : 'transparent', color: isLogin ? colors[50] : colors[300] }}>
              Log In
            </button>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleSocialLogin('google')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" style={{ border: `1px solid ${colors[600]}`, color: colors[100] }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button onClick={() => handleSocialLogin('github')} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50" style={{ border: `1px solid ${colors[600]}`, color: colors[100] }}>
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: colors[600] }}></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2" style={{ background: colors[800], color: colors[400] }}>Or continue with email</span></div>
          </div>

          {!isLogin ? (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><User className="w-4 h-4" /> Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500" style={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><Calendar className="w-4 h-4" /> Birthday</label>
                <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500" style={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><Mail className="w-4 h-4" /> Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500" style={inputStyle} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><Lock className="w-4 h-4" /> Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 pr-10" style={inputStyle} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors[400] }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && <PasswordStrengthIndicator />}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><Lock className="w-4 h-4" /> Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 pr-10" style={{ ...inputStyle, borderColor: confirmPassword && password !== confirmPassword ? 'rgb(239, 68, 68)' : colors[600] }} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors[400] }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><XCircle className="w-3 h-3" />Passwords do not match</p>}
              </div>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={emailSubscription} onChange={(e) => setEmailSubscription(e.target.checked)} className="mt-1 accent-zinc-500" />
                  <div>
                    <span className="text-sm" style={{ color: colors[100] }}>Subscribe to email notifications</span>
                    <p className="text-xs" style={{ color: colors[400] }}>Get updates about new features</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required className="mt-1 accent-zinc-500" />
                  <span className="text-sm" style={{ color: colors[100] }}>
                    I agree to the{" "}
                    <button type="button" className="underline" style={{ color: colors[200] }} onClick={() => { sessionStorage.setItem('signup_form_state', JSON.stringify({ name, email, birthday, password, emailSubscription, termsAccepted })); navigate("/terms"); }}>Terms</button>
                    {" "}and{" "}
                    <button type="button" className="underline" style={{ color: colors[200] }} onClick={() => { sessionStorage.setItem('signup_form_state', JSON.stringify({ name, email, birthday, password, emailSubscription, termsAccepted })); navigate("/privacy"); }}>Privacy Policy</button>
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading || !termsAccepted || password !== confirmPassword} className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ background: colors[100], color: colors[900] }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
              </button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: colors[100] }}><Mail className="w-4 h-4" /> Email</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500" style={inputStyle} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium flex items-center gap-1" style={{ color: colors[100] }}><Lock className="w-4 h-4" /> Password</label>
                  <button type="button" className="text-xs" style={{ color: colors[300] }} onClick={() => { setForgotPasswordEmail(email); setShowForgotPassword(true); }}>Forgot password?</button>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 pr-10" style={inputStyle} />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors[400] }} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50" style={{ background: colors[100], color: colors[900] }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign In"}
              </button>
            </form>
          )}
        </div>

        <Link to="/" className="mt-6 flex items-center gap-2 justify-center text-sm" style={{ color: colors[300] }}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Auth;
