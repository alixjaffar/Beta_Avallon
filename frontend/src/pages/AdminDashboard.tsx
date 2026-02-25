import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  Coins, 
  Search, 
  Plus, 
  Minus, 
  RefreshCw,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ADMIN_EMAIL = "alij123402@gmail.com";

const AdminDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  
  // User list state
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Single user lookup
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  
  // Credit modification
  const [targetEmail, setTargetEmail] = useState("");
  const [creditAction, setCreditAction] = useState<"set" | "add" | "subtract">("set");
  const [creditAmount, setCreditAmount] = useState(100);
  const [modifying, setModifying] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const baseUrl = import.meta.env.PROD 
    ? 'https://avallon.ca'
    : 'http://localhost:3001';

  // Check if user is authorized admin
  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('avallon_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const email = session.email?.toLowerCase();
          setCurrentUserEmail(email || "");
          
          if (email === ADMIN_EMAIL.toLowerCase()) {
            setIsAuthorized(true);
            loadUsers();
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${baseUrl}/api/admin/credits`, {
        credentials: 'include',
        headers: {
          'x-user-email': ADMIN_EMAIL,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsers(data.totalUsers || 0);
      } else {
        const error = await response.json();
        toast({
          title: "Failed to load users",
          description: error.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoadingUsers(false);
  };

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Enter an email",
        description: "Please enter an email address to search",
        variant: "destructive",
      });
      return;
    }
    
    setSearching(true);
    setSearchResult(null);
    
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/credits?email=${encodeURIComponent(searchEmail.trim())}`,
        {
          credentials: 'include',
          headers: {
            'x-user-email': ADMIN_EMAIL,
          },
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setSearchResult(data);
        setTargetEmail(searchEmail.trim());
      } else {
        toast({
          title: "User not found",
          description: data.error || "Could not find user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setSearching(false);
  };

  const modifyCredits = async () => {
    if (!targetEmail.trim()) {
      toast({
        title: "Enter target email",
        description: "Please enter the email of the user to modify",
        variant: "destructive",
      });
      return;
    }
    
    if (creditAmount < 0) {
      toast({
        title: "Invalid amount",
        description: "Credit amount must be positive",
        variant: "destructive",
      });
      return;
    }
    
    setModifying(true);
    setLastResult(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/credits`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': ADMIN_EMAIL,
        },
        body: JSON.stringify({
          email: targetEmail.trim(),
          action: creditAction,
          amount: creditAmount,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLastResult(data);
        toast({
          title: "Credits updated!",
          description: `${targetEmail}: ${data.user.previousCredits} → ${data.user.newCredits} credits`,
        });
        
        // Refresh user list
        loadUsers();
        
        // Update search result if same user
        if (searchResult && searchResult.user?.email === targetEmail.trim()) {
          searchUser();
        }
      } else {
        toast({
          title: "Failed to update credits",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error updating credits",
        description: error.message,
        variant: "destructive",
      });
    }
    setModifying(false);
  };

  const bulkUpdateCredits = async (action: "set" | "add" | "ensure_minimum", amount: number) => {
    if (!confirm(`Are you sure you want to ${action} ${amount} credits for ALL users?`)) {
      return;
    }
    
    setModifying(true);
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/credits`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': ADMIN_EMAIL,
        },
        body: JSON.stringify({ action, amount }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Bulk update complete!",
          description: `Updated ${data.totalUsers} users`,
        });
        loadUsers();
      } else {
        toast({
          title: "Bulk update failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error in bulk update",
        description: error.message,
        variant: "destructive",
      });
    }
    setModifying(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You are not authorized to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Current account: <strong>{currentUserEmail || "Not logged in"}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Required: <strong>{ADMIN_EMAIL}</strong>
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{ADMIN_EMAIL}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{totalUsers}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Default Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-2xl font-bold">30</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admin Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modify Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Modify User Credits
            </CardTitle>
            <CardDescription>
              Set, add, or subtract credits from any user account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>User Email</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={creditAction} onValueChange={(v: any) => setCreditAction(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set">Set to exact amount</SelectItem>
                    <SelectItem value="add">Add credits</SelectItem>
                    <SelectItem value="subtract">Subtract credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min="0"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  onClick={modifyCredits} 
                  disabled={modifying}
                  className="w-full"
                >
                  {modifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {creditAction === "add" && <Plus className="w-4 h-4 mr-2" />}
                      {creditAction === "subtract" && <Minus className="w-4 h-4 mr-2" />}
                      {creditAction === "set" && <Coins className="w-4 h-4 mr-2" />}
                      Apply
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {lastResult && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>{lastResult.user.email}</strong>: {lastResult.user.previousCredits} → {lastResult.user.newCredits} credits
                  ({lastResult.user.action} {lastResult.user.amount})
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search User
            </CardTitle>
            <CardDescription>
              Look up a specific user's credit balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email to search..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                className="flex-1"
              />
              <Button onClick={searchUser} disabled={searching}>
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            
            {searchResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{searchResult.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Credits (File)</p>
                    <p className="font-medium text-lg">{searchResult.fileCredits}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Credits (DB)</p>
                    <p className="font-medium">{searchResult.user?.credits ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">{searchResult.note}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setTargetEmail(searchResult.user?.email || searchEmail);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Edit this user's credits
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Bulk Actions
            </CardTitle>
            <CardDescription>
              Apply credit changes to all users at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => bulkUpdateCredits("ensure_minimum", 30)}
                disabled={modifying}
              >
                Ensure everyone has 30+ credits
              </Button>
              <Button 
                variant="outline" 
                onClick={() => bulkUpdateCredits("add", 10)}
                disabled={modifying}
              >
                Give everyone +10 credits
              </Button>
              <Button 
                variant="outline" 
                onClick={() => bulkUpdateCredits("set", 30)}
                disabled={modifying}
              >
                Reset everyone to 30 credits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users
                </CardTitle>
                <CardDescription>
                  Showing {users.length} of {totalUsers} users
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={loadUsers} disabled={loadingUsers}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No users found in database</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-sm font-medium">
                          <Coins className="w-3 h-3" />
                          {user.credits ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setTargetEmail(user.email);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
