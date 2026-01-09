import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bot, Loader2, Save, Sparkles, ExternalLink, Lock, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface AgentBuilderPageProps {
  onAgentCreated?: (agentId: string, n8nId: string) => void;
  onUpgradeClick?: () => void;
}

export function AgentBuilderPage({ onAgentCreated, onUpgradeClick }: AgentBuilderPageProps) {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [n8nId, setN8nId] = useState<string | null>(null);
  const [n8nUrl, setN8nUrl] = useState<string | null>(null);
  const [featureGated, setFeatureGated] = useState(false);
  const [gateMessage, setGateMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://beta-avallon.onrender.com';

  const n8nBaseUrl = 'https://agents.avallon.ca';

  // Check feature access when component mounts
  useEffect(() => {
    checkFeatureAccess();
  }, []);

  const checkFeatureAccess = async () => {
    try {
      // First check if agents are gated for this user (using fetchWithAuth for proper plan check)
      const response = await fetchWithAuth(`${baseUrl}/api/n8n/agents`, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.featureGated) {
        setFeatureGated(true);
        setGateMessage(data.message || "AI Agents are not available on your current plan.");
        return;
      }

      // If not gated, auto-create workflow
      if (!agentId && !creating) {
        handleAutoCreate();
      }
    } catch (error) {
      console.error('Error checking feature access:', error);
      // If can't check, try to create anyway
      if (!agentId && !creating) {
        handleAutoCreate();
      }
    }
  };

  const handleAutoCreate = async () => {
    setCreating(true);
    const defaultName = `Agent ${new Date().toLocaleDateString()}`;
    const defaultPrompt = "You are a helpful AI assistant. Help users with their questions and tasks.";

    setName(defaultName);

    try {
      const response = await fetchWithAuth(`${baseUrl}/api/n8n/agents`, {
        method: 'POST',
        body: JSON.stringify({ 
          name: defaultName, 
          prompt: defaultPrompt 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a feature gating error
        if (data.upgradeRequired || response.status === 403) {
          setFeatureGated(true);
          setGateMessage(data.error || "AI Agents are not available on your current plan.");
          return;
        }
        throw new Error(data.error || 'Failed to create agent');
      }

      setAgentId(data.result.agentId);
      setN8nId(data.result.n8nId);
      setPrompt(defaultPrompt);
      
      if (data.result.n8nId) {
        setN8nUrl(`${n8nBaseUrl}/workflow/${data.result.n8nId}`);
      }

      toast({
        title: "Workflow Created!",
        description: "Your n8n workflow has been created. Start building your AI agent.",
      });

      if (onAgentCreated && data.result.agentId && data.result.n8nId) {
        onAgentCreated(data.result.agentId, data.result.n8nId);
      }
    } catch (error: any) {
      console.error('Auto-create error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateAgent = async () => {
    if (!agentId || !name.trim() || !prompt.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please provide both a name and prompt.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Update agent name
      const response = await fetchWithAuth(`${baseUrl}/api/n8n/agents/${agentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ 
          name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update agent');
      }

      // Note: Prompt updates would require updating the n8n workflow nodes
      // For now, we save it locally. Future enhancement: update n8n workflow via API
      toast({
        title: "Agent Updated!",
        description: "Your AI agent name has been updated. Prompt changes will be applied when you update the workflow in n8n.",
      });
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update agent.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show gated UI if feature is not available
  if (featureGated) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <Card className="max-w-lg w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shadow-lg mx-auto mb-6">
              <Lock className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Agents - Premium Feature</h3>
            <p className="text-muted-foreground mb-6">
              {gateMessage || "AI Agents are not available on the Free plan. Upgrade to Starter ($24.99/mo) or higher to create AI agents with n8n workflows."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={onUpgradeClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                size="lg"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Upgrade to Starter
              </Button>
              <p className="text-xs text-muted-foreground">
                Get access to AI Agents, External App integrations, and more
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-500" />
            AI Agent Builder
          </h3>
          <p className="text-muted-foreground mt-1">
            Build and customize your AI agent with n8n workflows
          </p>
        </div>
        {n8nUrl && (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                // Step 1: Send n8n invitation to user
                toast({
                  title: "Sending invitation...",
                  description: "Setting up your n8n access",
                });
                
                try {
                  const inviteResponse = await fetchWithAuth(`${baseUrl}/api/n8n/invite`, {
                    method: 'POST',
                  });
                  
                  const inviteData = await inviteResponse.json();
                  
                  if (inviteResponse.ok) {
                    if (inviteData.alreadyActive) {
                      // User already has active account - just open n8n
                      toast({
                        title: "✅ You already have an account!",
                        description: "Opening n8n login page...",
                      });
                      window.open(`${inviteData.n8nUrl || n8nBaseUrl}/signin`, '_blank', 'noopener,noreferrer');
                    } else {
                      // Invitation sent - tell user to check email
                      toast({
                        title: "📧 Invitation Sent!",
                        description: "Check your email to set up your n8n account.",
                        duration: 10000,
                      });
                      
                      // Show alert with more details
                      alert(`Invitation sent to: ${inviteData.email}\n\nCheck your email (including spam folder) for the invitation to set up your n8n account.\n\nOnce you set up your account, you can access n8n at:\n${inviteData.n8nUrl || n8nBaseUrl}`);
                    }
                    return;
                  } else {
                    // Show error but continue to fallback
                    console.error('Invite error:', inviteData.error);
                  }
                } catch (inviteError) {
                  console.error('Invite error:', inviteError);
                  // Continue with password flow as fallback
                }
                
                // Get user email from localStorage session (for display purposes)
                let userEmail = null;
                try {
                  const sessionData = localStorage.getItem('avallon_session');
                  if (sessionData) {
                    const session = JSON.parse(sessionData);
                    userEmail = session.email;
                  }
                } catch (e) {
                  console.error('Error getting session:', e);
                }
                
                // Get password and show it to user, then redirect to n8n
                const passwordResponse = await fetchWithAuth(`${baseUrl}/api/n8n/password`, {
                  method: 'GET',
                });
                
                const passwordData = await passwordResponse.json();
                
                if (passwordResponse.ok && passwordData.password) {
                  const n8nLoginUrl = `${passwordData.n8nUrl || n8nBaseUrl}/login`;
                  const workflowUrl = `${passwordData.n8nUrl || n8nBaseUrl}/workflow/${n8nId}`;
                  
                  // Show password in alert (one-time display)
                  const warningMsg = passwordData.warning ? `\n\n⚠️ ${passwordData.warning}` : '';
                  const pendingMsg = passwordData.isPending ? `\n\n🚨 ACCOUNT PENDING ACTIVATION:\n${passwordData.activationInstructions || 'Your account needs to be activated in n8n admin UI before you can log in.'}` : '';
                  const message = `Your n8n Login Credentials:\n\nEmail: ${passwordData.email}\nPassword: ${passwordData.password}${warningMsg}${pendingMsg}\n\nClick OK to open n8n login page.`;
                  if (confirm(message)) {
                    window.open(n8nLoginUrl, '_blank', 'noopener,noreferrer');
                    // Also open workflow URL in case they're already logged in
                    setTimeout(() => {
                      window.open(workflowUrl, '_blank', 'noopener,noreferrer');
                    }, 2000);
                  }
                } else {
                  // User not found - try to trigger onboarding
                  const errorMsg = passwordData.error || 'Failed to get password';
                  if (errorMsg.includes('not found') || errorMsg.includes('onboarding')) {
                    // Try to trigger onboarding
                    try {
                      const onboardResponse = await fetchWithAuth(`${baseUrl}/api/users/onboard`, {
                        method: 'POST',
                        body: JSON.stringify({ email: userEmail }),
                      });
                      
                      if (onboardResponse.ok) {
                        const onboardData = await onboardResponse.json();
                        
                        // Check if password is in onboarding response (DB storage failed)
                        if (onboardData.n8nPassword) {
                          const n8nLoginUrl = `${onboardData.n8nAccount?.id ? n8nBaseUrl : n8nBaseUrl}/login`;
                          const workflowUrl = `${n8nBaseUrl}/workflow/${n8nId}`;
                          const message = `Your n8n Login Credentials:\n\nEmail: ${onboardData.n8nAccount?.email || userEmail}\nPassword: ${onboardData.n8nPassword}\n\n⚠️ Database storage failed - please save this password!\n\nClick OK to open n8n login page.`;
                          if (confirm(message)) {
                            window.open(n8nLoginUrl, '_blank', 'noopener,noreferrer');
                            setTimeout(() => {
                              window.open(workflowUrl, '_blank', 'noopener,noreferrer');
                            }, 2000);
                          }
                          return;
                        }
                        
                        // Retry getting password from password endpoint
                        const retryResponse = await fetchWithAuth(`${baseUrl}/api/n8n/password`, {
                          method: 'GET',
                        });
                        const retryData = await retryResponse.json();
                        
                        if (retryResponse.ok && retryData.password) {
                          const n8nLoginUrl = `${retryData.n8nUrl || n8nBaseUrl}/login`;
                          const workflowUrl = `${retryData.n8nUrl || n8nBaseUrl}/workflow/${n8nId}`;
                          const message = `Your n8n Login Credentials:\n\nEmail: ${retryData.email}\nPassword: ${retryData.password}\n\nClick OK to open n8n login page.`;
                          if (confirm(message)) {
                            window.open(n8nLoginUrl, '_blank', 'noopener,noreferrer');
                            setTimeout(() => {
                              window.open(workflowUrl, '_blank', 'noopener,noreferrer');
                            }, 2000);
                          }
                          return;
                        }
                      }
                    } catch (onboardError) {
                      console.error('Onboarding error:', onboardError);
                    }
                  }
                  
                  // Show error and fallback
                  alert(`Error: ${errorMsg}\n\nOpening n8n directly. You may need to use "Forgot Password" to reset your n8n account password.`);
                  window.open(n8nUrl, '_blank', 'noopener,noreferrer');
                }
              } catch (error: any) {
                console.error('Error getting password:', error);
                alert(`Error: ${error.message || 'Failed to get password'}\n\nOpening n8n directly.`);
                window.open(n8nUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in n8n
          </Button>
        )}
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side - Prompt Builder */}
        <div className="w-1/3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Agent Prompt
              </CardTitle>
              <CardDescription>
                Describe what your AI agent should do and how it should behave
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g., Customer Support Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={creating || !agentId}
                />
              </div>

              <div className="flex-1 flex flex-col space-y-2">
                <Label htmlFor="agent-prompt">Agent Prompt</Label>
                <Textarea
                  id="agent-prompt"
                  placeholder="Describe your agent's role, capabilities, and personality. For example:&#10;&#10;You are a helpful customer support assistant that:&#10;- Answers questions about products&#10;- Helps with order tracking&#10;- Provides technical support&#10;- Maintains a friendly and professional tone"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={creating || !agentId}
                  className="flex-1 resize-none"
                  rows={15}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about your agent's role, capabilities, and personality. The more detail you provide, the better your agent will perform.
                </p>
              </div>

              <Button
                onClick={handleUpdateAgent}
                disabled={!agentId || !name.trim() || !prompt.trim() || saving || creating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Agent
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - n8n Workflow Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                n8n Workflow Editor
              </CardTitle>
              <CardDescription>
                Visual workflow builder for your AI agent
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-6 relative">
              {creating ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Creating Workflow...</h3>
                    <p className="text-muted-foreground">
                      Setting up your n8n workflow editor
                    </p>
                  </div>
                </div>
              ) : n8nUrl ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Bot className="w-16 h-16 text-purple-500" />
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">n8n Workflow Editor</h3>
                    <p className="text-muted-foreground max-w-md">
                      Your workflow has been created! Click the button below to open it in n8n's visual editor.
                      Note: n8n cannot be embedded in an iframe due to security restrictions.
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={async () => {
                        try {
                          // Get user email from multiple sources
                          let userEmail = null;
                          try {
                            // Try localStorage first
                            const sessionData = localStorage.getItem('avallon_session');
                            if (sessionData) {
                              const session = JSON.parse(sessionData);
                              userEmail = session.email;
                            }
                            // If not found, try other storage methods
                            if (!userEmail) {
                              const userData = localStorage.getItem('user');
                              if (userData) {
                                const user = JSON.parse(userData);
                                userEmail = user.email;
                              }
                            }
                            // Try Clerk if available
                            if (!userEmail && (window as any).Clerk) {
                              const clerk = (window as any).Clerk;
                              if (clerk.user) {
                                userEmail = clerk.user.primaryEmailAddress?.emailAddress;
                              }
                            }
                          } catch (e) {
                            console.error('Error getting session:', e);
                          }
                          
                          // Get password and show it to user, then redirect to n8n
                          if (!userEmail) {
                            // Show error if email not found
                            alert('Could not find your email. Please log out and log back in.');
                            return;
                          }
                          
                          const passwordResponse = await fetchWithAuth(`${baseUrl}/api/n8n/password`, {
                            method: 'GET',
                          });
                          
                          const passwordData = await passwordResponse.json();
                          
                          if (passwordResponse.ok && passwordData.password) {
                            const n8nLoginUrl = `${passwordData.n8nUrl || n8nBaseUrl}/login`;
                            const workflowUrl = `${passwordData.n8nUrl || n8nBaseUrl}/workflow/${n8nId}`;
                            
                            // Show password in alert (one-time display)
                            const warningMsg = passwordData.warning ? `\n\n⚠️ ${passwordData.warning}` : '';
                            const pendingMsg = passwordData.isPending ? `\n\n🚨 ACCOUNT PENDING ACTIVATION:\n${passwordData.activationInstructions || 'Your account needs to be activated in n8n admin UI before you can log in.'}` : '';
                            const message = `Your n8n Login Credentials:\n\nEmail: ${passwordData.email}\nPassword: ${passwordData.password}${warningMsg}${pendingMsg}\n\nClick OK to open n8n login page.`;
                            if (confirm(message)) {
                              window.open(n8nLoginUrl, '_blank', 'noopener,noreferrer');
                              // Also open workflow URL in case they're already logged in
                              setTimeout(() => {
                                window.open(workflowUrl, '_blank', 'noopener,noreferrer');
                              }, 2000);
                            }
                          } else {
                            // Show error and fallback
                            const errorMsg = passwordData.error || 'Failed to get password';
                            alert(`Error: ${errorMsg}\n\nOpening n8n directly. You may need to use "Forgot Password" to reset your n8n account password.`);
                            window.open(n8nUrl, '_blank', 'noopener,noreferrer');
                          }
                        } catch (error: any) {
                          console.error('Error getting password:', error);
                          alert(`Error: ${error.message || 'Failed to get password'}\n\nOpening n8n directly.`);
                          window.open(n8nUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                      size="lg"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open in n8n Editor
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(n8nUrl);
                        toast({
                          title: "Copied!",
                          description: "Workflow URL copied to clipboard",
                        });
                      }}
                    >
                      Copy URL
                    </Button>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground max-w-md">
                    <p className="font-semibold mb-2">Workflow ID:</p>
                    <code className="text-xs">{n8nId}</code>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Workflow Available</h3>
                    <p className="text-muted-foreground mb-4">
                      A workflow will appear here once it's created.
                    </p>
                    <Button onClick={handleAutoCreate} variant="outline">
                      Create Workflow
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

