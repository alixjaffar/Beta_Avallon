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
  AlertTriangle,
  ExternalLink
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
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Workspace settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Workspaces allow you to collaborate on projects in real time.
              </p>
            </div>

            {/* Workspace Avatar */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Workspace avatar</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Set an avatar for your workspace.</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="size-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
                  style={workspaceAvatar ? { backgroundImage: `url(${workspaceAvatar})`, backgroundSize: 'cover' } : {}}
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

            {/* Workspace Name */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Workspace name</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Your full workspace name, as visible to others.</p>
              <div className="relative">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => saveWorkspaceName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {workspaceName.length} / 100 characters
                </span>
              </div>
            </div>

            {/* Workspace Description */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Workspace description</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">A short description about your workspace or team.</p>
              <div className="relative">
                <textarea
                  value={workspaceDescription}
                  onChange={(e) => saveWorkspaceDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Description"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                />
                <span className="absolute right-3 bottom-3 text-xs text-slate-400">
                  {workspaceDescription.length} / 500 characters
                </span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Leave workspace</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                You cannot leave your last workspace. Your account must be a member of at least one workspace.
              </p>
              <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                Leave workspace
              </button>
            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Plans & credits</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your subscription and credit balance.
              </p>
            </div>

            {/* Current Plan Card */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${
                    subscription?.plan === 'growth' ? 'bg-purple-500' :
                    subscription?.plan === 'starter' ? 'bg-blue-500' : 'bg-slate-400'
                  }`}>
                    {subscription?.plan === 'growth' ? <Crown className="w-5 h-5 text-white" /> :
                     subscription?.plan === 'starter' ? <Zap className="w-5 h-5 text-white" /> :
                     <CreditCard className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                      {subscription?.plan || 'Free'} Plan
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {subscription?.plan === 'growth' ? '$39.99/mo' :
                       subscription?.plan === 'starter' ? '$24.99/mo' : 'Free'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  subscription?.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {subscription?.status || 'Active'}
                </span>
              </div>

              {/* Credits */}
              <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Credits</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {subscription?.plan === 'growth' ? '250' :
                     subscription?.plan === 'starter' ? '100' : '15'} credits/month with your plan
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{credits ?? '...'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">available</p>
                </div>
              </div>

              {/* Next billing */}
              {subscription?.currentPeriodEnd && (
                <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Next billing date</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your subscription renews automatically</p>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Buy Credits - Pay As You Go */}
            <div className="p-6 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Buy Credits</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pay-as-you-go • $0.30 per credit</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">How many credits?</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={creditQuantity}
                      onChange={(e) => setCreditQuantity(Number(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <div className="w-20 text-center">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{creditQuantity}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400"> credits</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    ${(creditQuantity * 0.30).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleBuyCredits}
                disabled={buyingCredits}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
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

            {/* Upgrade Options */}
            {(!subscription?.plan || subscription.plan === 'free') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleUpgrade('starter')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to Starter ($24.99/mo)
                </button>
                <button
                  onClick={() => handleUpgrade('growth')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-medium rounded-lg transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Growth ($39.99/mo)
                </button>
              </div>
            )}

            {/* Plan Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Compare plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free */}
                <div className={`p-4 rounded-xl border ${
                  (!subscription?.plan || subscription.plan === 'free') 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Free</span>
                    {(!subscription?.plan || subscription.plan === 'free') && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$0<span className="text-sm font-normal text-slate-500">/mo</span></p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 30 credits/month
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 1 website
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">✗ AI Agents</li>
                  </ul>
                </div>

                {/* Starter */}
                <div className={`p-4 rounded-xl border ${
                  subscription?.plan === 'starter' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Starter</span>
                    {subscription?.plan === 'starter' && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$24.99<span className="text-sm font-normal text-slate-500">/mo</span></p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 100 credits/month
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> Multi-site creation
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 1 AI Agent
                    </li>
                  </ul>
                </div>

                {/* Growth */}
                <div className={`p-4 rounded-xl border-2 ${
                  subscription?.plan === 'growth' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-purple-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Growth</span>
                    {subscription?.plan === 'growth' ? (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">Current</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-purple-500 text-white rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$39.99<span className="text-sm font-normal text-slate-500">/mo</span></p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 250 credits/month
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> 4 AI Agents
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-green-500" /> Email Hosting
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Account settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your personal account settings and preferences.
              </p>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div 
                className="size-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl overflow-hidden"
                style={profilePhoto ? { backgroundImage: `url(${profilePhoto})`, backgroundSize: 'cover' } : {}}
              >
                {!profilePhoto && userInitial}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{userName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{userEmail}</p>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Change email</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="text-sm font-medium text-slate-900 dark:text-white">Change password</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Danger zone</h3>
              <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
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
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Connectors</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Connect external services to enhance your workflow.
              </p>
            </div>

            <div className="space-y-4">
              {/* GitHub */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
                    <Github className="w-5 h-5 text-white dark:text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">GitHub</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Deploy directly to GitHub repos</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Connect
                </button>
              </div>

              {/* Vercel */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-black flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 76 65" fill="currentColor">
                      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">Vercel</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Deploy to Vercel hosting</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  Connected
                </span>
              </div>
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Labs</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try experimental features before they're released.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
              <FlaskConical className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No experimental features available yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Check back soon!</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 dark:text-slate-400">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="w-full max-w-4xl max-h-[85vh] bg-white dark:bg-[#1a1d2d] rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col overflow-y-auto">
          <div className="p-4 flex-1">
            {sidebarItems.map((item, index) => {
              // Render section header
              if (item.section && (index === 0 || sidebarItems[index - 1].section !== item.section)) {
                return (
                  <React.Fragment key={`section-${item.section}`}>
                    {index > 0 && <div className="h-px bg-slate-200 dark:bg-slate-700 my-3" />}
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2">
                      {item.section}
                    </p>
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as SettingsTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTab === item.id
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {item.isWorkspace && (
                        <div 
                          className="size-6 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                          style={workspaceAvatar ? { backgroundImage: `url(${workspaceAvatar})`, backgroundSize: 'cover' } : {}}
                        >
                          {!workspaceAvatar && userInitial}
                        </div>
                      )}
                      {item.isAccount && (
                        <div 
                          className="size-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                          style={profilePhoto ? { backgroundImage: `url(${profilePhoto})`, backgroundSize: 'cover' } : {}}
                        >
                          {!profilePhoto && userInitial}
                        </div>
                      )}
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span className="truncate">{item.label}</span>
                      {activeTab === item.id && item.isWorkspace && (
                        <Check className="w-4 h-4 ml-auto text-primary" />
                      )}
                    </button>
                  </React.Fragment>
                );
              }

              // Render regular item
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {item.isWorkspace && (
                    <div 
                      className="size-6 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                      style={workspaceAvatar ? { backgroundImage: `url(${workspaceAvatar})`, backgroundSize: 'cover' } : {}}
                    >
                      {!workspaceAvatar && userInitial}
                    </div>
                  )}
                  {item.isAccount && (
                    <div 
                      className="size-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden"
                      style={profilePhoto ? { backgroundImage: `url(${profilePhoto})`, backgroundSize: 'cover' } : {}}
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">help</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">Docs</span>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
