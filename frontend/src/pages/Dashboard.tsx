import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Site } from "@/lib/api";
import { fetchWithAuth, clearAuth } from "@/lib/fetchWithAuth";
import { WebsiteEditor } from "@/components/WebsiteEditor";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { SettingsModal } from "@/components/SettingsModal";

// User type - simplified for Firebase
interface FirebaseUser {
  email: string | null;
  displayName: string | null;
  uid: string;
  photoURL: string | null;
}

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

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beta-avallon.onrender.com' 
    : 'http://localhost:3000';

  const loadSites = async () => {
    try {
      const response = await apiClient.getSites();
      // Handle both response formats: { data: [...] } or direct array
      const sitesData = response?.data?.data || response?.data || [];
      const sortedSites = [...sitesData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
      setSites(sortedSites);
    } catch (error: any) {
      // Silently handle errors - show empty state instead of crashing
      // Only log in development
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
        setCredits(data.credits ?? data.remainingCredits ?? 20);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
      setCredits(15); // Default to 15 on error
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
      
      // Open editor with initial prompt if provided
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
    loadSites(); // Refresh sites after editing
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
      // Sign out from Firebase (lazy import to avoid blocking)
      const { logoutUser } = await import('@/lib/firebase');
      await logoutUser();
      // Clear local auth data
      clearAuth();
      // Clear backend session
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
    // Check if coming from landing page with a prompt
    const state = location.state as { generatePrompt?: string } | null;
    if (state?.generatePrompt) {
      // Clear the state
      window.history.replaceState({}, document.title);
      // Create website with the prompt after loading
      setTimeout(() => {
        handleCreateWebsite(state.generatePrompt);
      }, 500);
    }

    const loadUser = async () => {
      try {
        // First check localStorage session
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

        // Try to load Firebase user (lazy import)
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
              // Save to session
              localStorage.setItem('avallon_session', JSON.stringify({
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                uid: firebaseUser.uid,
                photoURL: firebaseUser.photoURL
              }));
            } else {
              // No user - redirect to auth
              navigate('/auth');
            }
            setLoading(false);
          });
          
          // Cleanup on unmount
          return () => unsubscribe();
        } catch (firebaseError) {
          console.warn('Firebase not available, using session data only');
          // Redirect to auth if no session
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    if (menuOpenId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpenId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse text-lg text-white">Loading...</div>
      </div>
    );
  }

  // If editing a site, show the editor full screen
  if (editingSite) {
    return (
      <div className="fixed inset-0 z-50 bg-background-dark">
        <WebsiteEditor
          site={editingSite}
          onUpdate={handleWebsiteUpdated}
          onClose={handleCloseEditor}
        />
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-border-dark bg-white/80 dark:bg-[#101322]/80 backdrop-blur-md px-6 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-primary">
              <div className="size-8">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Avallon</h2>
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-primary text-sm font-semibold leading-normal relative py-4 cursor-default">
                Websites
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></span>
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal flex items-center gap-1 cursor-not-allowed opacity-60">
                Analytics
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </span>
              <button 
                onClick={() => setShowSettings(true)}
                className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Settings
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">token</span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {credits !== null ? credits : '...'} credits
              </span>
            </div>
            
            <button 
              onClick={() => handleCreateWebsite()}
              disabled={creatingSite}
              className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {creatingSite ? (
                <span className="material-symbols-outlined mr-2 text-[18px] animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
              )}
              <span className="truncate">New Website</span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-border-dark"></div>
            
            {/* Theme Toggle */}
            <ThemeToggleButton />
            
            {/* Profile Dropdown */}
            <UserProfileDropdown 
              user={user}
              credits={credits}
              onSignOut={handleSignOut}
              onOpenSettings={() => setShowSettings(true)}
            />
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-1">Your Websites</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage, edit, and publish your AI-generated sites.</p>
          </div>
          
          {/* Mobile specific Create Button */}
          <button 
            onClick={() => handleCreateWebsite()}
            disabled={creatingSite}
            className="sm:hidden flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal disabled:opacity-50"
          >
            <span className="material-symbols-outlined mr-2">add_circle</span>
            Create New Website
          </button>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sites.map((site) => (
            <article 
              key={site.id} 
              className="group relative flex flex-col bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Thumbnail with Mini Live Preview */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#0b0d15] rounded-t-xl">
                {site.websiteContent && Object.keys(site.websiteContent).length > 0 ? (
                  <div className="absolute inset-0 pointer-events-none">
                    <iframe
                      srcDoc={(() => {
                        const html = site.websiteContent['index.html'] || Object.values(site.websiteContent)[0] || '';
                        // Add scale transform to fit preview
                        return html.replace('</head>', `
                          <style>
                            body { transform: scale(0.25); transform-origin: top left; width: 400%; height: 400%; }
                            * { pointer-events: none !important; }
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
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600">web</span>
                  </div>
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button 
                    onClick={() => handleEditWebsite(site)}
                    className="flex items-center justify-center h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Edit Site
                  </button>
                  {site.previewUrl && (
                    <a 
                      href={site.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-10 bg-white dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-border-dark text-slate-900 dark:text-white rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      title="Preview"
                    >
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg leading-tight truncate">{site.name}</h3>
                    {site.previewUrl ? (
                      <a 
                        href={site.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 dark:text-slate-400 text-xs hover:text-primary transition-colors truncate block mt-0.5"
                      >
                        {site.previewUrl.replace('https://', '')}
                      </a>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Not connected</p>
                    )}
                  </div>
                  
                  {/* More menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === site.id ? null : site.id);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors -mr-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-border-dark"
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    
                    {menuOpenId === site.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-lg shadow-xl z-50">
                        <button
                          onClick={() => handleEditWebsite(site)}
                          className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-border-dark flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        {site.previewUrl && (
                          <a
                            href={site.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-border-dark flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            Open
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteWebsite(site)}
                          disabled={deletingSiteId === site.id}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          {deletingSiteId === site.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-border-dark mt-1">
                  {site.status === 'deployed' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Published</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700/50">
                      <div className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {site.status === 'generating' ? 'Generating' : 'Draft'}
                      </span>
                    </div>
                  )}
                  <span className="text-slate-400 dark:text-slate-500 text-xs">
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
            className="group flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-slate-300 dark:border-border-dark hover:border-primary dark:hover:border-primary rounded-xl aspect-[4/3] sm:aspect-auto hover:bg-slate-100/50 dark:hover:bg-card-hover/30 transition-all duration-300 gap-4 min-h-[300px] disabled:opacity-50"
          >
            <div className="size-14 rounded-full bg-slate-100 dark:bg-border-dark group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              {creatingSite ? (
                <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors">add</span>
              )}
            </div>
            <div className="text-center px-4">
              <p className="text-slate-900 dark:text-white font-semibold text-lg">Create New Website</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start from scratch or use AI</p>
            </div>
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => handleCreateWebsite()}
          disabled={creatingSite}
          className="flex items-center gap-3 bg-primary hover:bg-blue-600 text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95 group disabled:opacity-50"
        >
          {creatingSite ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined group-hover:animate-pulse">auto_awesome</span>
          )}
          <span className="font-bold tracking-wide">Generate with AI</span>
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
