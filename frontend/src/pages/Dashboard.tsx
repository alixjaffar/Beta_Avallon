import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Site } from "@/lib/api";
import { fetchWithAuth, clearAuth } from "@/lib/fetchWithAuth";
import { WebsiteEditor } from "@/components/WebsiteEditor";
import { SettingsModal } from "@/components/SettingsModal";
import { Plus, Sparkles, MoreVertical, Edit, ExternalLink, Trash2, Settings, BarChart3, Lock, Globe, LogOut, User } from "lucide-react";

// User type - simplified for Firebase
interface FirebaseUser {
  email: string | null;
  displayName: string | null;
  uid: string;
  photoURL: string | null;
}

// Color palette matching index page
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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [creatingSite, setCreatingSite] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beta-avallon.onrender.com' 
    : 'http://localhost:3000';

  const loadSites = async () => {
    try {
      const response = await apiClient.getSites();
      const sitesData = response?.data?.data || response?.data || [];
      const sortedSites = [...sitesData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      setSites(sortedSites);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Could not load sites:', error?.response?.status || error?.message);
      }
      setSites([]);
    }
  };

  const loadCredits = async () => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/credits`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits ?? data.remainingCredits ?? 30);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
      setCredits(30);
    }
  };

  const handleCreateWebsite = async (initialPrompt?: string) => {
    try {
      setCreatingSite(true);
      
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
      const newSite = result.result || result.data || result;
      
      if (!newSite.id) {
        throw new Error('Site was created but no ID was returned');
      }
      
      if (newSite.status !== 'generating') {
        newSite.status = 'generating';
      }
      
      setSites(prev => [newSite, ...prev]);
      
      if (initialPrompt) {
        setEditingSite({ ...newSite, initialPrompt });
      } else {
        setEditingSite(newSite);
      }
      
      toast({
        title: "Editor Opened",
        description: "Enter your website description to generate your website with AI",
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
    loadSites();
  };

  const handleDeleteWebsite = async (site: Site) => {
    if (!confirm(`Are you sure you want to delete "${site.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingSiteId(site.id);
    setMenuOpenId(null);

    try {
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete website');
      }

      setSites(prev => prev.filter(s => s.id !== site.id));
      
      toast({
        title: "Success",
        description: `Website "${site.name}" has been deleted.`,
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

  const handleSignOut = async () => {
    try {
      const { logoutUser } = await import('@/lib/firebase');
      await logoutUser();
      clearAuth();
      await fetch(`${baseUrl}/api/session/me`, { method: 'DELETE' }).catch(() => {});
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    navigate("/");
  };

  const getTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${diffWeeks}w ago`;
  };

  useEffect(() => {
    const state = location.state as { generatePrompt?: string } | null;
    if (state?.generatePrompt) {
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        handleCreateWebsite(state.generatePrompt);
      }, 500);
    }

    const loadUser = async () => {
      try {
        const sessionData = localStorage.getItem('avallon_session');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const userFromSession: FirebaseUser = {
            uid: session.uid || session.email || 'user_id',
            email: session.email || 'user@example.com',
            displayName: session.name || session.email?.split('@')[0] || 'User',
            photoURL: session.photoURL || null
          };
          setUser(userFromSession);
          setLoading(false);
          loadSites();
          loadCredits();
          return;
        }

        try {
          const { onAuthChange } = await import('@/lib/firebase');
          const unsubscribe = onAuthChange((firebaseUser) => {
            if (firebaseUser) {
              const userData: FirebaseUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
              };
              setUser(userData);
              localStorage.setItem('avallon_session', JSON.stringify({
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                uid: firebaseUser.uid,
                photoURL: firebaseUser.photoURL
              }));
            } else {
              navigate('/auth');
            }
            setLoading(false);
          });
          
          return () => unsubscribe();
        } catch (firebaseError) {
          console.warn('Firebase not available, using session data only');
          navigate('/auth');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/auth');
        setLoading(false);
      }
      
      loadSites();
      loadCredits();
    };
    
    loadUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenId(null);
      setShowProfileMenu(false);
    };
    if (menuOpenId || showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpenId, showProfileMenu]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors[900] }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (editingSite) {
    return (
      <div className="fixed inset-0 z-50" style={{ background: colors[900] }}>
        <WebsiteEditor
          site={editingSite}
          onUpdate={handleWebsiteUpdated}
          onClose={handleCloseEditor}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: colors[900], color: colors[100] }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="text-xl font-bold tracking-tight" style={{ color: colors[50] }}>
                Avallon
              </Link>
            </div>

            {/* Center Nav - Absolutely Centered */}
            <div className="hidden md:flex items-center gap-1 py-1 px-1 rounded-full absolute left-1/2 -translate-x-1/2" style={{ background: `${colors[800]}80`, border: `1px solid ${colors[400]}20` }}>
              <button className="px-5 py-2 text-sm font-medium rounded-full transition-all" style={{ background: colors[700], color: colors[100] }}>
                Websites
              </button>
              <button className="px-5 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 opacity-50 cursor-not-allowed" style={{ color: colors[300] }}>
                Analytics
                <Lock size={14} />
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="px-5 py-2 text-sm font-medium rounded-full transition-all hover:opacity-100 opacity-70"
                style={{ color: colors[200] }}
              >
                Settings
              </button>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex justify-end items-center gap-3">
              {/* Credits */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${colors[700]}80`, border: `1px solid ${colors[400]}30` }}>
                <Sparkles size={16} style={{ color: colors[200] }} />
                <span className="text-sm font-medium" style={{ color: colors[200] }}>
                  {credits !== null ? credits : '...'} credits
                </span>
              </div>

              {/* New Website Button */}
              <button 
                onClick={() => handleCreateWebsite()}
                disabled={creatingSite}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all disabled:opacity-50"
                style={{ background: colors[100], color: colors[900] }}
              >
                {creatingSite ? (
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin"></div>
                ) : (
                  <Plus size={18} />
                )}
                New Website
              </button>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: colors[700], border: `1px solid ${colors[400]}30` }}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={18} style={{ color: colors[200] }} />
                  )}
                </button>

                {showProfileMenu && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-2xl py-2 z-50"
                    style={{ background: colors[800], border: `1px solid ${colors[400]}30` }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: `${colors[400]}20` }}>
                      <p className="text-sm font-medium" style={{ color: colors[100] }}>{user?.displayName || 'User'}</p>
                      <p className="text-xs mt-0.5" style={{ color: colors[300] }}>{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSettings(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors hover:bg-zinc-700/50"
                      style={{ color: colors[200] }}
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors hover:bg-zinc-700/50 text-red-400"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extralight tracking-tight mb-2" style={{ color: colors[50] }}>
                Your Websites
              </h1>
              <p className="text-base font-light" style={{ color: colors[300] }}>
                Manage, edit, and publish your AI-generated sites.
              </p>
            </div>
            
            {/* Mobile Create Button */}
            <button 
              onClick={() => handleCreateWebsite()}
              disabled={creatingSite}
              className="sm:hidden flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-lg disabled:opacity-50"
              style={{ background: colors[100], color: colors[900] }}
            >
              <Plus size={18} />
              Create New Website
            </button>
          </div>

          {/* Websites Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sites.map((site) => (
              <article 
                key={site.id} 
                className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
                style={{ 
                  background: colors[800],
                  border: `1px solid ${colors[400]}20`,
                }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden" style={{ background: colors[700] }}>
                  {site.websiteContent && Object.keys(site.websiteContent).length > 0 ? (
                    <div className="absolute inset-0 pointer-events-none">
                      <iframe
                        srcDoc={(() => {
                          let html = site.websiteContent['index.html'] || Object.values(site.websiteContent)[0] || '';
                          html = html.replace(/src="data:[^"]{500,}"/gi, 'src="about:blank"');
                          html = html.replace(/src='data:[^']{500,}'/gi, "src='about:blank'");
                          html = html.replace(/url\(['"]?data:[^'")\s]{500,}['"]?\)/gi, 'url()');
                          html = html.replace(/src="blob:[^"]+"/gi, 'src="about:blank"');
                          html = html.replace(/url\(['"]?blob:[^'")\s]+['"]?\)/gi, 'url()');
                          return html.replace('</head>', `
                            <style>
                              body { transform: scale(0.25); transform-origin: top left; width: 400%; height: 400%; }
                              * { pointer-events: none !important; }
                              img[src="about:blank"] { display: none; }
                            </style>
                          </head>`);
                        })()}
                        className="w-[400%] h-[400%] border-0 scale-[0.25] origin-top-left"
                        title={`Preview of ${site.name}`}
                        loading="lazy"
                        sandbox="allow-same-origin allow-scripts"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe size={48} style={{ color: colors[500] }} />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3"
                    style={{ background: `${colors[900]}cc`, backdropFilter: 'blur(4px)' }}
                  >
                    <button 
                      onClick={() => handleEditWebsite(site)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      style={{ background: colors[100], color: colors[900] }}
                    >
                      <Edit size={16} />
                      Edit Site
                    </button>
                    {site.previewUrl && (
                      <a 
                        href={site.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75"
                        style={{ background: colors[700], border: `1px solid ${colors[400]}30` }}
                      >
                        <ExternalLink size={18} style={{ color: colors[200] }} />
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base leading-tight truncate" style={{ color: colors[50] }}>{site.name}</h3>
                      {site.previewUrl ? (
                        <a 
                          href={site.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs truncate block mt-1 hover:underline"
                          style={{ color: colors[300] }}
                        >
                          {site.previewUrl.replace('https://', '')}
                        </a>
                      ) : (
                        <p className="text-xs mt-1" style={{ color: colors[400] }}>Not published</p>
                      )}
                    </div>
                    
                    {/* Menu */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === site.id ? null : site.id);
                        }}
                        className="p-1.5 rounded-md transition-colors hover:bg-zinc-700/50"
                        style={{ color: colors[300] }}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {menuOpenId === site.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl z-50 py-1"
                          style={{ background: colors[700], border: `1px solid ${colors[400]}30` }}
                        >
                          <button
                            onClick={() => handleEditWebsite(site)}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-zinc-600/50"
                            style={{ color: colors[200] }}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          {site.previewUrl && (
                            <a
                              href={site.previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-zinc-600/50"
                              style={{ color: colors[200] }}
                            >
                              <ExternalLink size={14} />
                              Open
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteWebsite(site)}
                            disabled={deletingSiteId === site.id}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-red-900/30 text-red-400"
                          >
                            <Trash2 size={14} />
                            {deletingSiteId === site.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: `${colors[400]}15` }}>
                    {site.status === 'deployed' ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-green-400">Published</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${colors[600]}50`, border: `1px solid ${colors[400]}30` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[400] }}></div>
                        <span className="text-xs font-medium" style={{ color: colors[300] }}>
                          {site.status === 'generating' ? 'Generating' : 'Draft'}
                        </span>
                      </div>
                    )}
                    <span className="text-xs" style={{ color: colors[400] }}>
                      {getTimeAgo(site.updatedAt || site.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* Create New Card */}
            <button 
              onClick={() => handleCreateWebsite()}
              disabled={creatingSite}
              className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed min-h-[300px] transition-all duration-300 hover:border-zinc-500 disabled:opacity-50"
              style={{ borderColor: colors[600] }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: colors[700] }}
              >
                {creatingSite ? (
                  <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
                ) : (
                  <Plus size={28} style={{ color: colors[300] }} />
                )}
              </div>
              <p className="font-medium text-lg" style={{ color: colors[100] }}>Create New Website</p>
              <p className="text-sm mt-1" style={{ color: colors[400] }}>Start from scratch or use AI</p>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => handleCreateWebsite()}
          disabled={creatingSite}
          className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{ background: colors[100], color: colors[900] }}
        >
          {creatingSite ? (
            <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-700 rounded-full animate-spin"></div>
          ) : (
            <Sparkles size={20} />
          )}
          <span className="font-semibold">Generate with AI</span>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        credits={credits}
      />
    </div>
  );
};

export default Dashboard;
