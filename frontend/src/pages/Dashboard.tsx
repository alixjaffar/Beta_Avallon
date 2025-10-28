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
import { WebsiteCreationModal } from "@/components/WebsiteCreationModal";
import { AdvancedWebsiteCreationModal } from "@/components/AdvancedWebsiteCreationModal";
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
  LayoutDashboard
} from "lucide-react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [creatingSite, setCreatingSite] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadSites = async () => {
    try {
      const response = await apiClient.getSites();
      setSites(response.data.data || []);
    } catch (error) {
      console.error('Failed to load sites:', error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    }
  };

  const handleCreateWebsite = () => {
    setShowCreateModal(true);
  };

  const handleCreateAdvancedWebsite = () => {
    setShowAdvancedModal(true);
  };

  const handleWebsiteCreated = (site: Site) => {
    setSites(prev => [...prev, site]);
    toast({
      title: "Success",
      description: "Website created successfully! Opening editor...",
    });
    // Automatically open the Lovable-style editor
    setEditingSite(site);
  };

  const handleEditWebsite = (site: Site) => {
    setEditingSite(site);
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

      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://beta-avallon1.vercel.app' : 'http://localhost:3000'}/api/sites/${site.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
    // Bypass Supabase authentication for now - directly load sites
    const mockUser = {
      id: 'mock_user_id',
      email: 'user@example.com',
      user_metadata: { name: 'Demo User' }
    } as User;
    
    setUser(mockUser);
    loadSites();
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    // Bypass Supabase sign out for now
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
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user?.email}</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
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
          <TabsList className="grid w-full grid-cols-5 mb-12 h-auto p-1 bg-muted/50">
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
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-16">
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
                <p className="text-muted-foreground">AI-powered web creation and management</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleCreateWebsite}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Quick Create
                </Button>
                <Button 
                  onClick={handleCreateAdvancedWebsite}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Advanced AI
                </Button>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <Card key={site.id} className="group hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          site.status === 'deployed' ? 'bg-green-100 text-green-800' :
                          site.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                          site.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {site.status}
                        </div>
                      </div>
                      <CardDescription>Created {new Date(site.createdAt).toLocaleDateString()}</CardDescription>
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
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            )}
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">AI Agents</h3>
                <p className="text-muted-foreground">Intelligent automation and workflows</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Agent
              </Button>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent"></div>
              <CardContent className="p-12 text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4">No AI agents yet</h4>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Build custom AI agents and workflows to automate your business processes
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">Domains</h3>
                <p className="text-muted-foreground">Register and manage your domain portfolio</p>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-transparent"></div>
              <CardContent className="p-12 text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg mx-auto mb-6">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4">No domains yet</h4>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Register, transfer, and manage your domain portfolio in one place
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Domain
                </Button>
              </CardContent>
            </Card>
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
        </Tabs>
      </main>

          {/* Website Creation Modal */}
          <WebsiteCreationModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleWebsiteCreated}
          />

          {/* Advanced Website Creation Modal */}
          <AdvancedWebsiteCreationModal
            isOpen={showAdvancedModal}
            onClose={() => setShowAdvancedModal(false)}
            onSuccess={handleWebsiteCreated}
          />

          {/* Website Editor */}
          {editingSite && (
            <div className="fixed inset-0 z-50 bg-background">
              <WebsiteEditor
                site={editingSite}
                onUpdate={handleWebsiteUpdated}
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
