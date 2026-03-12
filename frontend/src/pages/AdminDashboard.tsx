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
  AlertCircle,
  Globe,
  Edit,
  Trash2,
  Eye,
  LogIn,
  ExternalLink,
  Upload
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ADMIN_EMAIL = "alij123402@gmail.com";

interface Site {
  id: string;
  name: string;
  slug: string;
  status: string;
  previewUrl: string | null;
  ownerId: string;
  ownerEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("sites");
  
  // User list state
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Sites state
  const [sites, setSites] = useState<Site[]>([]);
  const [totalSites, setTotalSites] = useState(0);
  const [loadingSites, setLoadingSites] = useState(false);
  const [filterOwnerEmail, setFilterOwnerEmail] = useState("");
  
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
  
  // Impersonation
  const [impersonateEmail, setImpersonateEmail] = useState("");
  const [impersonating, setImpersonating] = useState(false);
  
  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [deleting, setDeleting] = useState(false);

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
            loadSites();
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

  const loadSites = async (ownerEmail?: string) => {
    setLoadingSites(true);
    try {
      let url = `${baseUrl}/api/admin/sites`;
      if (ownerEmail) {
        url += `?ownerEmail=${encodeURIComponent(ownerEmail)}`;
      }
      
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'x-user-email': ADMIN_EMAIL,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSites(data.sites || []);
        setTotalSites(data.totalSites || 0);
      } else {
        const error = await response.json();
        toast({
          title: "Failed to load sites",
          description: error.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading sites",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoadingSites(false);
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
        loadUsers();
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

  const publishSite = async (siteId: string, action: 'publish' | 'unpublish') => {
    try {
      const response = await fetch(`${baseUrl}/api/admin/sites`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': ADMIN_EMAIL,
        },
        body: JSON.stringify({ siteId, action }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: action === 'publish' ? "Site Published!" : "Site Unpublished",
          description: `Site is now ${action === 'publish' ? 'live' : 'draft'}`,
        });
        loadSites(filterOwnerEmail || undefined);
      } else {
        toast({
          title: "Action failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSite = async () => {
    if (!deleteTarget) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`${baseUrl}/api/admin/sites`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': ADMIN_EMAIL,
        },
        body: JSON.stringify({ siteId: deleteTarget.id, action: 'delete' }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Site Deleted",
          description: `${deleteTarget.name} has been deleted`,
        });
        loadSites(filterOwnerEmail || undefined);
      } else {
        toast({
          title: "Delete failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const impersonateUser = (email: string) => {
    // Set session as if logged in as that user
    const sessionData = {
      email: email,
      name: email.split('@')[0],
      ts: Date.now(),
      isImpersonated: true,
      impersonatedBy: ADMIN_EMAIL,
    };
    
    localStorage.setItem('avallon_session', JSON.stringify(sessionData));
    
    toast({
      title: "Impersonating User",
      description: `Now logged in as ${email}. Redirecting to dashboard...`,
    });
    
    // Navigate to dashboard as that user
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const openSiteEditor = (siteId: string, ownerEmail: string | null) => {
    // First impersonate the user, then open the editor
    if (ownerEmail) {
      const sessionData = {
        email: ownerEmail,
        name: ownerEmail.split('@')[0],
        ts: Date.now(),
        isImpersonated: true,
        impersonatedBy: ADMIN_EMAIL,
        editingSiteId: siteId,
      };
      localStorage.setItem('avallon_session', JSON.stringify(sessionData));
    }
    
    // Open the dashboard - the site will be available
    navigate(`/dashboard?edit=${siteId}`);
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
      <header className="border-b bg-card sticky top-0 z-50">
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

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sites" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users & Credits
            </TabsTrigger>
            <TabsTrigger value="impersonate" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Impersonate
            </TabsTrigger>
          </TabsList>

          {/* SITES TAB */}
          <TabsContent value="sites" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      All Sites ({totalSites})
                    </CardTitle>
                    <CardDescription>
                      Manage all sites across all users. You can edit, publish, or delete any site.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => loadSites(filterOwnerEmail || undefined)} disabled={loadingSites}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingSites ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter by owner */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Filter by owner email..."
                    value={filterOwnerEmail}
                    onChange={(e) => setFilterOwnerEmail(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={() => loadSites(filterOwnerEmail || undefined)} disabled={loadingSites}>
                    <Search className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  {filterOwnerEmail && (
                    <Button variant="ghost" onClick={() => { setFilterOwnerEmail(""); loadSites(); }}>
                      Clear
                    </Button>
                  )}
                </div>

                {loadingSites ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : sites.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No sites found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Site Name</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sites.map((site) => (
                        <TableRow key={site.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{site.name}</p>
                              <p className="text-xs text-muted-foreground">{site.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{site.ownerEmail || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground">{site.ownerId.substring(0, 16)}...</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              site.status === 'live' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {site.status === 'live' ? <CheckCircle className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
                              {site.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(site.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {site.previewUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(site.previewUrl!, '_blank')}
                                  title="View Live"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openSiteEditor(site.id, site.ownerEmail)}
                                title="Edit Site"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {site.status !== 'live' ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-600"
                                  onClick={() => publishSite(site.id, 'publish')}
                                  title="Publish"
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-yellow-600"
                                  onClick={() => publishSite(site.id, 'unpublish')}
                                  title="Unpublish"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600"
                                onClick={() => setDeleteTarget(site)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS & CREDITS TAB */}
          <TabsContent value="users" className="space-y-6">
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold">{totalSites}</span>
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
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Actions</CardTitle>
                <CardDescription>Apply credit changes to all users at once</CardDescription>
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
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Showing {users.length} of {totalUsers} users</CardDescription>
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
                  <p className="text-center py-8 text-muted-foreground">No users found</p>
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
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setFilterOwnerEmail(user.email);
                                  loadSites(user.email);
                                  setActiveTab("sites");
                                }}
                                title="View Sites"
                              >
                                <Globe className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setTargetEmail(user.email);
                                }}
                                title="Edit Credits"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-600"
                                onClick={() => impersonateUser(user.email)}
                                title="Login as User"
                              >
                                <LogIn className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* IMPERSONATE TAB */}
          <TabsContent value="impersonate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <LogIn className="w-5 h-5" />
                  Impersonate User
                </CardTitle>
                <CardDescription>
                  Login as any user to view their dashboard, edit their sites, and publish on their behalf.
                  No password required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter user's email address..."
                    value={impersonateEmail}
                    onChange={(e) => setImpersonateEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => impersonateUser(impersonateEmail)}
                    disabled={!impersonateEmail.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login as User
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How it works:</h4>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                    <li>Enter the user's email address</li>
                    <li>Click "Login as User"</li>
                    <li>You'll be redirected to their dashboard</li>
                    <li>Edit their sites, publish changes, etc.</li>
                    <li>Return to admin panel when done</li>
                  </ol>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Quick impersonate:</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                    Click any user in the Users tab to quickly impersonate them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Site?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteSite} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
