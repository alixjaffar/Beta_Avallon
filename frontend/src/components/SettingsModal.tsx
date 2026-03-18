import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { 
  X, 
  Users, 
  CreditCard, 
  Cloud, 
  Shield, 
  FlaskConical, 
  Link2,
  Github,
  Check,
  Zap,
  Crown,
  Loader2,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  credits: number | null;
}

type SettingsTab = 'workspace' | 'people' | 'plans' | 'cloud' | 'privacy' | 'account' | 'labs' | 'connectors' | 'github';

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
}

// Color palette matching the theme
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

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  credits,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [workspaceName, setWorkspaceName] = useState('My Workspace');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [workspaceAvatar, setWorkspaceAvatar] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beta-avallon.onrender.com' 
    : 'http://localhost:3000';

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (isOpen) {
      loadSubscription();
      loadSettings();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const loadSubscription = async () => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/plan`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedWorkspaceName = localStorage.getItem('avallon_workspace_name');
    const savedWorkspaceDesc = localStorage.getItem('avallon_workspace_description');
    const savedWorkspaceAvatar = localStorage.getItem('avallon_workspace_avatar');
    const savedProfilePhoto = localStorage.getItem('avallon_profile_photo');
    
    if (savedWorkspaceName) setWorkspaceName(savedWorkspaceName);
    if (savedWorkspaceDesc) setWorkspaceDescription(savedWorkspaceDesc);
    if (savedWorkspaceAvatar) setWorkspaceAvatar(savedWorkspaceAvatar);
    if (savedProfilePhoto) setProfilePhoto(savedProfilePhoto);
  };

  const saveWorkspaceName = (name: string) => {
    setWorkspaceName(name);
    localStorage.setItem('avallon_workspace_name', name);
  };

  const saveWorkspaceDescription = (desc: string) => {
    setWorkspaceDescription(desc);
    localStorage.setItem('avallon_workspace_description', desc);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setWorkspaceAvatar(dataUrl);
        localStorage.setItem('avallon_workspace_avatar', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpgrade = async (plan: 'starter' | 'growth') => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval: 'monthly' }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start checkout",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const [buyingCredits, setBuyingCredits] = useState(false);
  const [creditQuantity, setCreditQuantity] = useState(10);

  const handleBuyCredits = async () => {
    try {
      setBuyingCredits(true);
      const response = await fetchWithAuth(`${baseUrl}/api/billing/buy-credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: creditQuantity }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start checkout",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setBuyingCredits(false);
    }
  };

  if (!isOpen) return null;

  const sidebarItems = [
    { id: 'workspace', label: workspaceName, icon: null, section: 'Workspace', isWorkspace: true },
    { id: 'people', label: 'People', icon: Users, section: null },
    { id: 'plans', label: 'Plans & credits', icon: CreditCard, section: null },
    { id: 'cloud', label: 'Cloud & AI balance', icon: Cloud, section: null },
    { id: 'privacy', label: 'Privacy & security', icon: Shield, section: null },
    { id: 'account', label: userName, icon: null, section: 'Account', isAccount: true },
    { id: 'labs', label: 'Labs', icon: FlaskConical, section: null },
    { id: 'connectors', label: 'Connectors', icon: Link2, section: 'Connectors' },
    { id: 'github', label: 'GitHub', icon: Github, section: null },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium" style={{ color: colors[50] }}>Workspace settings</h2>
              <p className="text-sm mt-1" style={{ color: colors[300] }}>
                Workspaces allow you to collaborate on projects in real time.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: colors[100] }}>Workspace avatar</h3>
              <p className="text-sm mb-3" style={{ color: colors[300] }}>Set an avatar for your workspace.</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden transition-all hover:ring-2 hover:ring-zinc-500"
                  style={{ 
                    background: workspaceAvatar ? `url(${workspaceAvatar}) center/cover` : colors[500]
                  }}
                >
                  {!workspaceAvatar && userInitial}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: colors[100] }}>Workspace name</h3>
              <p className="text-sm mb-3" style={{ color: colors[300] }}>Your full workspace name, as visible to others.</p>
              <div className="relative">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => saveWorkspaceName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  style={{ 
                    background: colors[800], 
                    border: `1px solid ${colors[600]}`,
                    color: colors[100]
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: colors[400] }}>
                  {workspaceName.length} / 100
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1" style={{ color: colors[100] }}>Workspace description</h3>
              <p className="text-sm mb-3" style={{ color: colors[300] }}>A short description about your workspace or team.</p>
              <div className="relative">
                <textarea
                  value={workspaceDescription}
                  onChange={(e) => saveWorkspaceDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Description"
                  className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
                  style={{ 
                    background: colors[800], 
                    border: `1px solid ${colors[600]}`,
                    color: colors[100]
                  }}
                />
                <span className="absolute right-3 bottom-3 text-xs" style={{ color: colors[400] }}>
                  {workspaceDescription.length} / 500
                </span>
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: colors[700] }}>
              <h3 className="text-sm font-medium mb-1" style={{ color: colors[100] }}>Leave workspace</h3>
              <p className="text-sm mb-3" style={{ color: colors[300] }}>
                You cannot leave your last workspace. Your account must be a member of at least one workspace.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-red-400 rounded-lg transition-colors hover:bg-red-900/30" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                Leave workspace
              </button>
            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium" style={{ color: colors[50] }}>Plans & credits</h2>
              <p className="text-sm mt-1" style={{ color: colors[300] }}>
                Manage your subscription and credit balance.
              </p>
            </div>

            <div className="p-6 rounded-xl" style={{ background: colors[800], border: `1px solid ${colors[600]}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                    background:
                      subscription?.plan === 'growth'
                        ? 'linear-gradient(135deg, #3f3f46, #18181b)'
                        : subscription?.plan === 'starter'
                          ? 'linear-gradient(135deg, #52525b, #27272a)'
                          : colors[500]
                  }}>
                    {subscription?.plan === 'growth' ? <Crown className="w-5 h-5 text-white" /> :
                     subscription?.plan === 'starter' ? <Zap className="w-5 h-5 text-white" /> :
                     <CreditCard className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize" style={{ color: colors[50] }}>
                      {subscription?.plan || 'Free'} Plan
                    </h3>
                    <p className="text-sm" style={{ color: colors[300] }}>
                      {subscription?.plan === 'growth' ? '$39.99/mo' :
                       subscription?.plan === 'starter' ? '$24.99/mo' : 'Free'}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full" style={{
                  background: subscription?.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : colors[700],
                  color: subscription?.status === 'active' ? '#4ade80' : colors[300]
                }}>
                  {subscription?.status || 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between py-4 border-t" style={{ borderColor: colors[700] }}>
                <div>
                  <p className="font-medium" style={{ color: colors[50] }}>Credits</p>
                  <p className="text-sm" style={{ color: colors[300] }}>
                    {subscription?.plan === 'growth' ? '250' :
                     subscription?.plan === 'starter' ? '100' : '15'} credits/month with your plan
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: colors[50] }}>{credits ?? '...'}</p>
                  <p className="text-xs" style={{ color: colors[400] }}>available</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ background: colors[800], border: `1px solid ${colors[600]}` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #52525b, #27272a)' }}>
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: colors[50] }}>Buy Credits</h3>
                  <p className="text-sm" style={{ color: colors[300] }}>Pay-as-you-go • $0.30 per credit</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm mb-2 block" style={{ color: colors[300] }}>How many credits?</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={creditQuantity}
                      onChange={(e) => setCreditQuantity(Number(e.target.value))}
                      className="flex-1 accent-zinc-400"
                    />
                    <div className="w-20 text-center">
                      <span className="text-lg font-bold" style={{ color: colors[50] }}>{creditQuantity}</span>
                      <span className="text-sm" style={{ color: colors[300] }}> credits</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: colors[100] }}>
                    ${(creditQuantity * 0.30).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleBuyCredits}
                disabled={buyingCredits}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #52525b, #27272a)' }}
              >
                {buyingCredits ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Buy {creditQuantity} Credits for ${(creditQuantity * 0.30).toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {(!subscription?.plan || subscription.plan === 'free') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleUpgrade('starter')}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #52525b, #27272a)' }}
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to Starter ($24.99/mo)
                </button>
                <button
                  onClick={() => handleUpgrade('growth')}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #3f3f46, #18181b)' }}
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Growth ($39.99/mo)
                </button>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: colors[50] }}>Compare plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'free', name: 'Free', price: '$0', icon: CreditCard, features: ['30 credits/month', '1 website', '✗ AI Agents'] },
                  { id: 'starter', name: 'Starter', price: '$24.99', icon: Zap, features: ['100 credits/month', 'Multi-site creation', '1 AI Agent'] },
                  { id: 'growth', name: 'Growth', price: '$39.99', icon: Crown, features: ['250 credits/month', '4 AI Agents', 'Email Hosting'], popular: true },
                ].map((plan) => (
                  <div 
                    key={plan.id}
                    className="p-4 rounded-xl transition-all"
                    style={{ 
                      background: colors[800],
                      border: `${plan.popular ? '2px' : '1px'} solid ${
                        subscription?.plan === plan.id ? colors[200] : 
                        plan.popular ? colors[500] : colors[600]
                      }`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <plan.icon className="w-4 h-4" style={{ color: plan.popular ? colors[200] : colors[300] }} />
                      <span className="font-medium" style={{ color: colors[50] }}>{plan.name}</span>
                      {subscription?.plan === plan.id && (
                        <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: `${colors[200]}20`, color: colors[200] }}>Current</span>
                      )}
                      {plan.popular && subscription?.plan !== plan.id && (
                        <span className="px-2 py-0.5 text-xs text-white rounded-full" style={{ background: colors[500] }}>Popular</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold mb-4" style={{ color: colors[50] }}>{plan.price}<span className="text-sm font-normal" style={{ color: colors[400] }}>/mo</span></p>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2" style={{ color: feature.startsWith('✗') ? colors[400] : colors[300] }}>
                          {!feature.startsWith('✗') && <Check className="w-4 h-4 text-green-500" />}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium" style={{ color: colors[50] }}>Account settings</h2>
              <p className="text-sm mt-1" style={{ color: colors[300] }}>
                Manage your personal account settings and preferences.
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: colors[800], border: `1px solid ${colors[600]}` }}>
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden"
                style={{ 
                  background: profilePhoto ? `url(${profilePhoto}) center/cover` : colors[500]
                }}
              >
                {!profilePhoto && userInitial}
              </div>
              <div>
                <h3 className="font-medium" style={{ color: colors[50] }}>{userName}</h3>
                <p className="text-sm" style={{ color: colors[300] }}>{userEmail}</p>
              </div>
            </div>

            <div className="space-y-3">
              {['Change email', 'Change password'].map((action) => (
                <button 
                  key={action}
                  className="w-full flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-zinc-800"
                  style={{ border: `1px solid ${colors[600]}` }}
                >
                  <span className="text-sm font-medium" style={{ color: colors[100] }}>{action}</span>
                  <ExternalLink className="w-4 h-4" style={{ color: colors[400] }} />
                </button>
              ))}
            </div>

            <div className="pt-4 border-t" style={{ borderColor: colors[700] }}>
              <h3 className="text-sm font-medium text-red-400 mb-3">Danger zone</h3>
              <button className="px-4 py-2 text-sm font-medium text-red-400 rounded-lg transition-colors hover:bg-red-900/30" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                Delete account
              </button>
            </div>
          </div>
        );

      case 'connectors':
      case 'github':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium" style={{ color: colors[50] }}>Connectors</h2>
              <p className="text-sm mt-1" style={{ color: colors[300] }}>
                Connect external services to enhance your workflow.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { name: 'GitHub', desc: 'Deploy directly to GitHub repos', icon: Github, connected: false },
                { name: 'Vercel', desc: 'Deploy to Vercel hosting', icon: () => (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 76 65" fill="currentColor">
                    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                  </svg>
                ), connected: true },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: colors[800], border: `1px solid ${colors[600]}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: colors[900] }}>
                      <service.icon />
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: colors[50] }}>{service.name}</h3>
                      <p className="text-sm" style={{ color: colors[300] }}>{service.desc}</p>
                    </div>
                  </div>
                  {service.connected ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80' }}>
                      Connected
                    </span>
                  ) : (
                    <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ border: `1px solid ${colors[400]}`, color: colors[200] }}>
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium" style={{ color: colors[50] }}>Labs</h2>
              <p className="text-sm mt-1" style={{ color: colors[300] }}>
                Try experimental features before they're released.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-dashed text-center" style={{ borderColor: colors[600] }}>
              <FlaskConical className="w-10 h-10 mx-auto mb-3" style={{ color: colors[400] }} />
              <p style={{ color: colors[300] }}>No experimental features available yet.</p>
              <p className="text-sm mt-1" style={{ color: colors[400] }}>Check back soon!</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p style={{ color: colors[300] }}>Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div 
        ref={modalRef}
        className="w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl overflow-hidden flex"
        style={{ background: colors[900], border: `1px solid ${colors[600]}` }}
      >
        {/* Sidebar */}
        <div className="w-64 border-r flex flex-col overflow-y-auto" style={{ borderColor: colors[700], background: colors[800] }}>
          <div className="p-4 flex-1">
            {sidebarItems.map((item, index) => {
              if (item.section && (index === 0 || sidebarItems[index - 1].section !== item.section)) {
                return (
                  <React.Fragment key={`section-${item.section}`}>
                    {index > 0 && <div className="h-px my-3" style={{ background: colors[700] }} />}
                    <p className="text-[10px] font-semibold uppercase tracking-wider px-3 py-2" style={{ color: colors[400] }}>
                      {item.section}
                    </p>
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as SettingsTab)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ 
                        background: activeTab === item.id ? colors[700] : 'transparent',
                        color: activeTab === item.id ? colors[50] : colors[300]
                      }}
                    >
                      {item.isWorkspace && (
                        <div 
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                          style={{ background: workspaceAvatar ? `url(${workspaceAvatar}) center/cover` : colors[500] }}
                        >
                          {!workspaceAvatar && userInitial}
                        </div>
                      )}
                      {item.isAccount && (
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                          style={{ background: profilePhoto ? `url(${profilePhoto}) center/cover` : colors[500] }}
                        >
                          {!profilePhoto && userInitial}
                        </div>
                      )}
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span className="truncate">{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ 
                    background: activeTab === item.id ? colors[700] : 'transparent',
                    color: activeTab === item.id ? colors[50] : colors[300]
                  }}
                >
                  {item.isWorkspace && (
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                      style={{ background: workspaceAvatar ? `url(${workspaceAvatar}) center/cover` : colors[500] }}
                    >
                      {!workspaceAvatar && userInitial}
                    </div>
                  )}
                  {item.isAccount && (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                      style={{ background: profilePhoto ? `url(${profilePhoto}) center/cover` : colors[500] }}
                    >
                      {!profilePhoto && userInitial}
                    </div>
                  )}
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors[700] }}>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" style={{ color: colors[400] }} />
              <span className="text-sm" style={{ color: colors[300] }}>Docs</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-zinc-800"
            >
              <X className="w-5 h-5" style={{ color: colors[300] }} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors[300] }} />
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
