import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, Calendar, TrendingUp, Send, Trash2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [refreshing, setRefreshing] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [emailTemplates, setEmailTemplates] = useState([
    {
      name: "Beta Launch Announcement",
      subject: "🚀 Avallon Beta is Here!",
      content: "We're excited to announce that Avallon beta is now live! You can now access our platform and start creating amazing websites. Log in to your account to get started."
    },
    {
      name: "Feature Update",
      subject: "✨ New Features Added to Avallon",
      content: "We've added some exciting new features to Avallon based on your feedback. Check out the latest updates and let us know what you think!"
    },
    {
      name: "Maintenance Notice",
      subject: "🔧 Scheduled Maintenance - Avallon",
      content: "We'll be performing scheduled maintenance on our servers. The platform will be temporarily unavailable during this time. We apologize for any inconvenience."
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    
    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://avallon.ca';
      const [statsResponse, signupsResponse] = await Promise.all([
        fetch(`${baseUrl}/api/beta-signups?type=stats`),
        fetch(`${baseUrl}/api/beta-signups?type=all`),
      ]);

      const statsData = await statsResponse.json();
      const signupsData = await signupsResponse.json();

      setStats(statsData.stats);
      setSignups(signupsData.signups);
      setLastUpdated(new Date());
      
      if (isManualRefresh) {
        toast({
          title: "Success",
          description: "Data refreshed successfully",
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch signup data. Make sure backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
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

    if (!stats?.emailSubscribers || stats.emailSubscribers === 0) {
      toast({
        title: "No Subscribers",
        description: "There are no email subscribers to send emails to.",
        variant: "destructive",
      });
      return;
    }

    setSendingEmail(true);
    setLastEmailResult(null);
    
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://avallon.ca';
      const response = await fetch(`${baseUrl}/api/bulk-email`, {
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
        setLastEmailResult({
          sent: result.sent,
          failed: result.failed,
          total: result.totalSubscribers
        });
        
        toast({
          title: "Success!",
          description: `Email sent to ${result.sent} subscribers${result.failed > 0 ? ` (${result.failed} failed)` : ''}`,
        });
        
        // Clear form after successful send
        setEmailSubject("");
        setEmailContent("");
        
        // Refresh data to get updated stats
        fetchData();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send bulk email",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Bulk email error:', error);
      toast({
        title: "Error",
        description: "Failed to send bulk email. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const useTemplate = (template: {subject: string, content: string}) => {
    setEmailSubject(template.subject);
    setEmailContent(template.content);
  };

  const deleteSignup = async (signupId: string, signupName: string) => {
    if (!confirm(`Are you sure you want to delete ${signupName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://avallon.ca';
      const response = await fetch(`${baseUrl}/api/beta-signups/${signupId}`, {
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
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://avallon.ca';
                window.open(`${baseUrl}/admin/emails`, '_blank');
              }} 
              variant="outline"
            >
              📧 View Email Logs
            </Button>
            <Button 
              onClick={() => fetchData(true)} 
              variant="outline"
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </>
              )}
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
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Update Email
            </CardTitle>
            <CardDescription>
              Send an update email to all subscribers ({stats?.emailSubscribers || 0} subscribers)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Templates */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Templates</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {emailTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => useTemplate(template)}
                  >
                    <div>
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{template.subject}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-4">
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
            </div>

            {/* Last Email Result */}
            {lastEmailResult && (
              <Alert className={lastEmailResult.failed > 0 ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}>
                <div className="flex items-center gap-2">
                  {lastEmailResult.failed > 0 ? (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  <AlertDescription className="text-sm">
                    <strong>Email Results:</strong> {lastEmailResult.sent} sent, {lastEmailResult.failed} failed out of {lastEmailResult.total} total subscribers
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Send Button */}
            <Button 
              onClick={sendBulkEmail} 
              disabled={sendingEmail || !emailSubject.trim() || !emailContent.trim() || !stats?.emailSubscribers}
              className="w-full"
              size="lg"
            >
              {sendingEmail ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to All Subscribers ({stats?.emailSubscribers || 0})
                </>
              )}
            </Button>

            {/* Warning for no subscribers */}
            {stats?.emailSubscribers === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No email subscribers found. Users need to opt-in to email notifications during signup.
                </AlertDescription>
              </Alert>
            )}
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
