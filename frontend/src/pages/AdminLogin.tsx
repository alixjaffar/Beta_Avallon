import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn } from "lucide-react";

const ADMIN_EMAIL = "alij123402@gmail.com";

const AdminLogin = () => {
  const [targetEmail, setTargetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem("avallon_session");
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.email) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetEmail) {
      toast({
        title: "Email Required",
        description: "Enter the user email to access.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/auth/admin-impersonate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: ADMIN_EMAIL,
          targetEmail: targetEmail.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        toast({
          title: "Access Denied",
          description: data.error || 'Failed to access account',
          variant: "destructive",
        });
        return;
      }

      // Create session
      localStorage.setItem("avallon_session", JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        ts: Date.now(),
        isImpersonated: true,
        impersonatedBy: ADMIN_EMAIL,
      }));

      toast({
        title: "Logged In",
        description: `Accessing ${targetEmail}`,
      });

      setTargetEmail("");
      navigate("/dashboard");

    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.message || "Failed to login.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="User email..."
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
