import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Calendar, TrendingUp, Send, Trash2 } from "lucide-react";

interface SignupStats {
  totalSignups: number;
  emailSubscribers: number;
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
}

interface Signup {
  id: string;
  name: string;
  email: string;
  birthday: string;
  emailSubscription: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<SignupStats | null>(null);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, signupsResponse] = await Promise.all([
        fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/beta-signups?type=stats`),
        fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/beta-signups?type=all`),
      ]);

      const statsData = await statsResponse.json();
      const signupsData = await signupsResponse.json();

      setStats(statsData.stats);
      setSignups(signupsData.signups);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch signup data. Make sure backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and content",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/bulk-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: `Email sent to ${result.sent} subscribers`,
        });
        setEmailSubject("");
        setEmailContent("");
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send bulk email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bulk email. Make sure backend is running.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const deleteSignup = async (signupId: string, signupName: string) => {
    if (!confirm(`Are you sure you want to delete ${signupName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/beta-signups/${signupId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success!",
          description: `${signupName} has been deleted`,
        });
        // Refresh the data
        fetchData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete signup",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete signup. Make sure backend is running.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Avallon Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage beta signups and send updates</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.open(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/admin/emails`, '_blank')} 
              variant="outline"
            >
              📧 View Email Logs
            </Button>
            <Button onClick={fetchData} variant="outline">
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSignups || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Subscribers</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.emailSubscribers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.signupsToday || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.signupsThisWeek || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.signupsThisMonth || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Email Section */}
        <Card>
          <CardHeader>
            <CardTitle>Send Update Email</CardTitle>
            <CardDescription>
              Send an update email to all subscribers ({stats?.emailSubscribers || 0} subscribers)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-content">Content</Label>
              <Textarea
                id="email-content"
                placeholder="Enter your update message..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={6}
              />
            </div>
            <Button 
              onClick={sendBulkEmail} 
              disabled={sendingEmail || !emailSubject.trim() || !emailContent.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendingEmail ? "Sending..." : "Send to All Subscribers"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Signups */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              Latest {signups.length} signups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signups.slice(0, 10).map((signup) => (
                <div key={signup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{signup.name}</p>
                    <p className="text-sm text-muted-foreground">{signup.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(signup.createdAt).toLocaleDateString()}
                      </p>
                      {signup.emailSubscription && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Subscribed
                        </span>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSignup(signup.id, signup.name)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
