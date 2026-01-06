import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import avallonLogo from "@/assets/avallon-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiClient, Site } from "@/lib/api";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
// Using unified Kirin AI website generation
import { WebsiteEditor } from "@/components/WebsiteEditor";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Bot, 
  Mail, 
  Server, 
  Plus, 
  LogOut,
  Sparkles,
  Zap,
  Shield,
  ChevronRight,
  Rocket,
  Database,
  Settings,
  LayoutDashboard,
  Plug
} from "lucide-react";
import IntegrationsManager from "@/components/IntegrationsManager";
import { User } from "@supabase/supabase-js";
import { DomainSetupFlow } from "@/components/DomainSetupFlow";
import { PricingModal } from "@/components/PricingModal";
import { AgentCreationModal } from "@/components/AgentCreationModal";
import { AgentBuilderPage } from "@/components/AgentBuilderPage";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [creatingSite, setCreatingSite] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [credits, setCredits] = useState<number>(20); // Default to 20 credits (free plan)
  const [creditCosts, setCreditCosts] = useState<{ generateWebsite: number; modifyWebsite: number } | null>(null);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadSites = async () => {
    try {
      // Use apiClient which now includes user email via interceptor
      const response = await apiClient.getSites();
      const sitesData = response.data?.data || [];
      // Sort sites by createdAt (most recent first)
      const sortedSites = [...sitesData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      setSites(sortedSites);
    } catch (error: any) {
      console.error('Failed to load sites:', error);
      // Don't show error toast if it's just an empty response
      if (error?.response?.status !== 401 && error?.response?.status !== 500) {
        toast({
          title: "Error",
          description: error?.response?.data?.error || "Failed to load websites",
          variant: "destructive",
        });
      }
      // Set empty array on error so UI doesn't break
      setSites([]);
    }
  };

  const loadIntegrations = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/integrations`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConnectedIntegrations(data.connected || []);
      }
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  const handleCreateWebsite = async () => {
    // Create a new site immediately and open the editor (like open-source AI Website Builder)
    try {
      setCreatingSite(true);
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      // Create a new empty site in the backend
      const siteName = `Website ${Date.now()}`;
      const response = await fetchWithAuth(`${baseUrl}/api/sites`, {
        method: 'POST',
        body: JSON.stringify({
          name: siteName,
          slug: siteName.toLowerCase().replace(/\s+/g, '-'),
          status: 'generating',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create site');
      }

      const result = await response.json();
      // API returns { result: newSite } or { data: newSite }
      const newSite = result.result || result.data || result;
      
      // Ensure the site has an id
      if (!newSite.id) {
        console.error('Site creation response:', result);
        throw new Error('Site was created but no ID was returned');
      }
      
      // Ensure status is set to 'generating' for new sites
      if (newSite.status !== 'generating') {
        newSite.status = 'generating';
      }
      
      // Add to sites list
      setSites(prev => [...prev, newSite]);
      
      // Immediately open the editor (like the open-source AI Website Builder)
      setEditingSite(newSite);
      
      toast({
        title: "Editor Opened",
        description: "Enter your website description in the chat to generate your website with Kirin",
      });
    } catch (error: any) {
      console.error('Failed to create site:', error);
      toast({
        title: "Error",
        description: "Failed to open editor",
        variant: "destructive",
      });
    } finally {
      setCreatingSite(false);
    }
  };

  const handleWebsiteCreated = (site: Site & { websiteContent?: any }) => {
    setSites(prev => [...prev, site]);
    toast({
      title: "Success",
      description: "Website created successfully! Opening editor...",
    });
      // Automatically open the Lovable-style editor
      setEditingSite(site);
      
      // Reload credits after website creation
      loadUserCredits();
    };

  const handleEditWebsite = (site: Site) => {
    setEditingSite(site);
    // Reload credits when opening editor
    loadUserCredits();
  };

  const handleWebsiteUpdated = (updatedSite: Site) => {
    setSites(prev => prev.map(site => 
      site.id === updatedSite.id ? updatedSite : site
    ));
  };

  const handleCloseEditor = () => {
    setEditingSite(null);
  };

  const handleDeleteWebsite = async (site: Site) => {
    if (!confirm(`Are you sure you want to delete "${site.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingSiteId(site.id);

    try {
      // Show loading state
      toast({
        title: "Deleting...",
        description: `Removing "${site.name}"...`,
      });

      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete website');
      }

      // Remove from local state
      setSites(prev => prev.filter(s => s.id !== site.id));
      
      toast({
        title: "Success",
        description: `Website "${site.name}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Error",
        description: "Failed to delete website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingSiteId(null);
    }
  };

  useEffect(() => {
    // Check for upgrade success/cancel in URL params
    const params = new URLSearchParams(window.location.search);
    const upgradeStatus = params.get('upgrade');
    if (upgradeStatus === 'success') {
      toast({
        title: "Upgrade Successful!",
        description: "Your subscription has been activated. Welcome to Premium!",
      });
      // Remove query param from URL
      window.history.replaceState({}, '', '/dashboard');
      // Reload plan and credits
      loadUserPlan();
      loadUserCredits();
    } else if (upgradeStatus === 'cancelled') {
      toast({
        title: "Upgrade Cancelled",
        description: "No charges were made. You can upgrade anytime.",
      });
      window.history.replaceState({}, '', '/dashboard');
    }

    // Get user from localStorage (set during login) or try Supabase session
    const loadUser = async () => {
      try {
        // First check localStorage for session (instant - no async needed)
        const sessionData = localStorage.getItem('avallon_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const userFromSession = {
            id: session.email || 'user_id',
            email: session.email || 'user@example.com',
            user_metadata: { name: session.name || session.email?.split('@')[0] || 'User' }
          } as User;
          setUser(userFromSession);
          // Show UI immediately after user is loaded
          setLoading(false);
        } else {
          // Try to get Supabase session (with timeout)
          try {
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Session timeout')), 2000)
            );
            const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
          if (session?.user) {
            setUser(session.user);
          } else {
            // Fallback to mock user
            const mockUser = {
              id: 'mock_user_id',
              email: 'user@example.com',
              user_metadata: { name: 'Demo User' }
            } as User;
            setUser(mockUser);
          }
          } catch (sessionError) {
            // Fallback to mock user if session check fails or times out
            const mockUser = {
              id: 'mock_user_id',
              email: 'user@example.com',
              user_metadata: { name: 'Demo User' }
            } as User;
            setUser(mockUser);
          }
          // Show UI immediately after user is loaded
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Fallback to mock user
        const mockUser = {
          id: 'mock_user_id',
          email: 'user@example.com',
          user_metadata: { name: 'Demo User' }
        } as User;
        setUser(mockUser);
        // Show UI even on error
        setLoading(false);
      }
      
      // Load all data in parallel AFTER UI is shown (non-blocking)
      // Add timeouts to prevent hanging
      const loadWithTimeout = async (fn: () => Promise<void>, timeoutMs: number) => {
        try {
          await Promise.race([
            fn(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
          ]);
        } catch (err) {
          console.error('Load operation timed out or failed:', err);
        }
      };
      
      // Load data with individual timeouts (don't block UI)
      Promise.all([
        loadWithTimeout(() => loadSites(), 5000), // 5 second timeout
        loadWithTimeout(() => loadUserPlan(), 3000), // 3 second timeout
        loadWithTimeout(() => loadUserCredits(), 3000), // 3 second timeout
        loadWithTimeout(() => loadIntegrations(), 3000), // 3 second timeout
      ]).catch(err => console.error('Some data failed to load:', err));
      
      // Ensure user is onboarded asynchronously (don't block page load)
      ensureUserOnboarded();
    };
    
    loadUser();
  }, []);

  const ensureUserOnboarded = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      // Get user email from session
      const sessionData = localStorage.getItem('avallon_session');
      const userEmail = sessionData ? JSON.parse(sessionData).email : user?.email || 'user@example.com';
      
      // Check if user is onboarded
      const checkResponse = await fetchWithAuth(`${baseUrl}/api/users/onboard`, {
        method: 'GET',
      }).catch(() => null);
      
      if (checkResponse?.ok) {
        const data = await checkResponse.json();
        if (!data.onboarded) {
          // User not onboarded, create their agent
          const onboardResponse = await fetchWithAuth(`${baseUrl}/api/users/onboard`, {
            method: 'POST',
            body: JSON.stringify({ email: userEmail }),
          }).catch(() => null);
          
          if (onboardResponse?.ok) {
            console.log('✅ User onboarded with n8n agent');
          }
        }
      }
    } catch (error) {
      console.error('Onboarding check error (non-blocking):', error);
      // Don't block dashboard load if onboarding fails
    }
  };

  const loadUserPlan = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      // Try to get user plan from backend
      const response = await fetchWithAuth(`${baseUrl}/api/billing/plan`, {
        method: 'GET',
      }).catch(() => null);
      
      if (response?.ok) {
        const data = await response.json();
        setCurrentPlan(data.plan || 'free');
      } else {
        // Default to free plan if API fails
        console.log('Plan API not available, defaulting to free');
        setCurrentPlan('free');
      }
    } catch (error) {
      console.error('Error loading plan:', error);
      // Default to free plan on error
      setCurrentPlan('free');
    }
  };

  const loadUserCredits = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      const response = await fetchWithAuth(`${baseUrl}/api/billing/credits`, {
        method: 'GET',
      }).catch(() => null);
      
      if (response?.ok) {
        const data = await response.json();
        // Default to 20 credits if API returns 0 or null (matches backend default)
        setCredits(data.credits || 20);
        if (data.costs) {
          setCreditCosts(data.costs);
        }
      } else {
        // Default to 20 credits if API fails (free plan default)
        setCredits(20);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
      // Default to 20 credits on error (free plan default)
      setCredits(20);
    }
  };

  const handleSignOut = async () => {
    // Clear localStorage session
    localStorage.removeItem('avallon_session');
    
    // Clear backend session cookie
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      await fetch(`${baseUrl}/api/session/me`, {
        method: 'DELETE',
      }).catch(() => {
        // Ignore errors - session will be cleared on next request
      });
    } catch (error) {
      // Ignore errors
    }
    
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={avallonLogo} alt="Avallon Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold">Avallon</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{user?.email || 'Loading...'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground capitalize">{currentPlan} Plan</span>
                  <span className="text-xs font-semibold text-purple-500">
                    {credits} Credits
                  </span>
                </div>
              </div>
              {currentPlan === 'free' && (
                <Button 
                  onClick={() => setPricingModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              )}
            </div>
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Welcome Back</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Web Creation Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Build, automate, and scale your web presence from one unified platform
          </p>
        </div>

        {/* Tabbed Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-12 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="websites" className="flex items-center gap-2 py-3">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Websites</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2 py-3">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Agents</span>
            </TabsTrigger>
            <TabsTrigger value="domains" className="flex items-center gap-2 py-3">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Domains</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2 py-3">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 py-3">
              <Plug className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-16">
            {/* Upgrade CTA Section */}
            {currentPlan === 'free' && (
              <section>
                <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent border-2 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-purple-500" />
                          Unlock Premium Features
                        </h3>
                        <p className="text-muted-foreground">
                          Upgrade to Pro or Business to get unlimited websites, advanced AI agents, priority support, and more.
                        </p>
                      </div>
                      <Button 
                        onClick={() => setPricingModalOpen(true)}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                        size="lg"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        View Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Quick Actions Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
                  <p className="text-muted-foreground">Get started with these powerful tools</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-7 h-7 text-purple-500" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Generate with AI</h4>
                    <p className="text-sm text-muted-foreground mb-4">Create content instantly</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-7 h-7 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Quick Deploy</h4>
                    <p className="text-sm text-muted-foreground mb-4">Launch in seconds</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Server className="w-7 h-7 text-orange-500" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Manage Hosting</h4>
                    <p className="text-sm text-muted-foreground mb-4">Control your servers</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-7 h-7 text-green-500" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Security</h4>
                    <p className="text-sm text-muted-foreground mb-4">Protect your assets</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Connected Integrations Section */}
            <section>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Connected Integrations</h3>
                    <p className="text-muted-foreground">External services connected to your account</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const integrationsTab = document.querySelector('[value="integrations"]') as HTMLElement;
                      if (integrationsTab) integrationsTab.click();
                    }}
                  >
                    <Plug className="w-4 h-4 mr-2" />
                    Manage Integrations
                  </Button>
                </div>
              </div>
              
              {connectedIntegrations.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4">
                        No integrations connected yet
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const integrationsTab = document.querySelector('[value="integrations"]') as HTMLElement;
                          if (integrationsTab) integrationsTab.click();
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Your First Integration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedIntegrations.map((integration) => (
                    <Card key={integration.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Plug className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{integration.providerInfo?.name || integration.provider}</h4>
                              <p className="text-xs text-muted-foreground">
                                {integration.metadata?.accountName || 'Connected'}
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="bg-green-500">Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Platform Stats Section */}
            <section>
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Platform Overview</h3>
                <p className="text-muted-foreground">Your activity and resources at a glance</p>
              </div>

              <Card className="bg-gradient-to-br from-card to-card/50">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Rocket className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold mb-2">0</div>
                      <p className="text-muted-foreground">Total Projects</p>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Bot className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold mb-2">0</div>
                      <p className="text-muted-foreground">Active Agents</p>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Globe className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold mb-2">0</div>
                      <p className="text-muted-foreground">Active Domains</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Ready to get started?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Create your first website, build an AI agent, or register a domain to begin your journey with Avallon.
                        </p>
                        <Button className="button-gradient">
                          <Rocket className="w-4 h-4 mr-2" />
                          Start Building
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Websites Tab */}
          <TabsContent value="websites" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">Websites</h3>
              </div>
              <Button 
                onClick={handleCreateWebsite}
                disabled={creatingSite}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
              >
                {creatingSite ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Opening Editor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Website with AI
                  </>
                )}
              </Button>
            </div>

            {sites.length === 0 ? (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent"></div>
                <CardContent className="p-12 text-center relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg mx-auto mb-6">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">No websites yet</h4>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Create stunning websites with AI assistance, templates, and drag-and-drop tools
                  </p>
                  <Button 
                    onClick={handleCreateWebsite}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Website
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Most Recent Website - Featured Section */}
                {sites.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Most Recent Website
                    </h4>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                              <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{sites[0].name}</CardTitle>
                              <CardDescription className="mt-1">
                                Created {new Date(sites[0].createdAt || sites[0].updatedAt).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </CardDescription>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sites[0].status === 'deployed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            sites[0].status === 'generating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            sites[0].status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {sites[0].status}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {sites[0].previewUrl && (
                            <div className="flex items-center gap-2 text-sm">
                              <Globe className="w-4 h-4 text-purple-500" />
                              <a 
                                href={sites[0].previewUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                              >
                                View Live Preview
                              </a>
                            </div>
                          )}
                          {sites[0].repoUrl && (
                            <div className="flex items-center gap-2 text-sm">
                              <Database className="w-4 h-4 text-purple-500" />
                              <a 
                                href={sites[0].repoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                              >
                                View Repository
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2 pt-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleEditWebsite(sites[0])}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Edit Website
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDeleteWebsite(sites[0])}
                              disabled={deletingSiteId === sites[0].id}
                            >
                              {deletingSiteId === sites[0].id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Other Websites Grid */}
                {sites.length > 1 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">All Websites</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sites.slice(1).map((site) => (
                        <Card key={site.id || `site-${site.name}-${site.createdAt}`} className="group hover:shadow-xl transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{site.name}</CardTitle>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                site.status === 'deployed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                site.status === 'generating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                site.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                                {site.status}
                              </div>
                            </div>
                            <CardDescription>
                              Created {new Date(site.createdAt || site.updatedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric'
                              })}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {site.previewUrl && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Globe className="w-4 h-4" />
                                  <a href={site.previewUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                    Preview Site
                                  </a>
                                </div>
                              )}
                              {site.repoUrl && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Database className="w-4 h-4" />
                                  <a href={site.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                    View Repository
                                  </a>
                                </div>
                              )}
                              <div className="flex items-center gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditWebsite(site)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={() => handleDeleteWebsite(site)}
                                  disabled={deletingSiteId === site.id}
                                >
                                  {deletingSiteId === site.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                      Deleting...
                                    </>
                                  ) : (
                                    'Delete'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-0">
            <AgentBuilderPage 
              onAgentCreated={(agentId, n8nId) => {
                toast({
                  title: "Agent Created!",
                  description: "Your AI agent workflow has been created successfully.",
                });
                // Optionally refresh agent list or update state
              }}
            />
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <DomainSetupFlow sites={sites} />
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">Email Hosting</h3>
                <p className="text-muted-foreground">Professional email for all your domains</p>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Setup Email
              </Button>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent"></div>
              <CardContent className="p-12 text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4">No email configured yet</h4>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Set up professional email addresses for all your domains
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Setup Your First Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">Integrations</h3>
                <p className="text-muted-foreground">
                  Connect external services to add powerful features to your generated websites
                </p>
              </div>
            </div>

            {/* Info Banner */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">How Integrations Work</h4>
                    <p className="text-sm text-muted-foreground">
                      When you connect an integration (like Stripe), your API keys will be automatically 
                      injected into any new websites you generate. This means your websites will have 
                      working payment buttons, analytics, and more - without any manual setup!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integrations Manager */}
            <IntegrationsManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Pricing Modal */}
      <PricingModal
        open={pricingModalOpen}
        onOpenChange={setPricingModalOpen}
        currentPlan={currentPlan}
        userEmail={user?.email}
      />

      <AgentCreationModal
        open={agentModalOpen}
        onOpenChange={setAgentModalOpen}
        onSuccess={() => {
          // Refresh agents list if needed
          toast({
            title: "Success!",
            description: "Agent created successfully. Refresh the page to see it in your list.",
          });
        }}
      />

      {/* Website Editor */}
      {editingSite && (
        <div className="fixed inset-0 z-50 bg-background">
          <WebsiteEditor
            site={editingSite}
            onUpdate={(updatedSite) => {
              handleWebsiteUpdated(updatedSite);
              // Reload credits after website update
              loadUserCredits();
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-10"
            onClick={handleCloseEditor}
          >
            Close Editor
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
