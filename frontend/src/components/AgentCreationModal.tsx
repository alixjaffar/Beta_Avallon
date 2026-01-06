import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, Loader2, Check, Rocket, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface AgentResult {
  agentId: string;
  name: string;
  status: string;
  n8nId: string | null;
  embedCode: string | null;
}

export function AgentCreationModal({ open, onOpenChange, onSuccess }: AgentCreationModalProps) {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const { toast } = useToast();

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://beta-avallon.onrender.com' 
    : 'http://localhost:3000';

  const handleCreateAgent = async () => {
    if (!name.trim() || name.length < 2) {
      toast({
        title: "Invalid Name",
        description: "Please enter an agent name (at least 2 characters)",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim() || prompt.length < 4) {
      toast({
        title: "Invalid Prompt",
        description: "Please enter a prompt describing what your agent should do (at least 4 characters)",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    setAgentResult(null);

    try {
      const response = await fetch(`${baseUrl}/api/n8n/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to create agent';
        const details = data.details ? ` ${data.details}` : '';
        throw new Error(`${errorMsg}${details}`);
      }

      setAgentResult(data.result);
      toast({
        title: "Agent Created!",
        description: "Your AI agent has been created successfully.",
      });
    } catch (error: any) {
      console.error('Agent creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handlePublishToN8n = async () => {
    if (!agentResult) return;

    setPublishing(true);
    try {
      const response = await fetch(`${baseUrl}/api/n8n/agents/${agentResult.agentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'publish' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish agent');
      }

      // Update agent result with new status
      setAgentResult({
        ...agentResult,
        status: 'active',
      });

      toast({
        title: "Published to n8n!",
        description: `Agent "${agentResult.name}" is now active and ready to use.`,
      });
      
      // Call onSuccess callback to refresh the agent list
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish agent.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setName("");
    setPrompt("");
    setAgentResult(null);
    onOpenChange(false);
  };

  const copyEmbedCode = () => {
    if (agentResult?.embedCode) {
      navigator.clipboard.writeText(agentResult.embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard.",
      });
    }
  };

  const isFormValid = name.trim().length >= 2 && prompt.trim().length >= 4;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-2">
            <Bot className="w-8 h-8 text-purple-500" />
            Create AI Agent
          </DialogTitle>
          <DialogDescription className="text-base">
            Build an intelligent AI agent powered by n8n. Describe what you want your agent to do.
          </DialogDescription>
        </DialogHeader>

        {!agentResult ? (
          <div className="space-y-6 mt-4">
            <Card className="border-2 border-dashed border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-500" />
                  n8n Agent Builder
                </CardTitle>
                <CardDescription>
                  Configure your AI agent's behavior and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input
                    id="agent-name"
                    placeholder="e.g., Customer Support Bot, Website Assistant"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={creating}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your agent a descriptive name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-prompt">Agent Prompt</Label>
                  <Textarea
                    id="agent-prompt"
                    placeholder="Describe what your agent should do. For example: 'You are a helpful customer support assistant that answers questions about our products, helps with orders, and provides technical support.'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={creating}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about your agent's role, capabilities, and personality
                  </p>
                </div>

                <Button
                  onClick={handleCreateAgent}
                  disabled={!isFormValid || creating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  size="lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Agent...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Create Agent
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  Agent Created Successfully!
                </CardTitle>
                <CardDescription>
                  Your AI agent has been created and is ready to publish to n8n.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-medium">Agent Name:</span>
                    <span className="text-muted-foreground">{agentResult.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <span className="font-medium">Status:</span>
                    <Badge variant={agentResult.status === 'active' ? 'default' : 'secondary'}>
                      {agentResult.status}
                    </Badge>
                  </div>
                  {agentResult.n8nId && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="font-medium">n8n Workflow ID:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{agentResult.n8nId}</code>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handlePublishToN8n}
                    disabled={publishing || agentResult.status === 'active'}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                    size="lg"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : agentResult.status === 'active' ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Published to n8n
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Publish to n8n
                      </>
                    )}
                  </Button>
                  {agentResult.embedCode && (
                    <Button
                      onClick={copyEmbedCode}
                      variant="outline"
                      size="lg"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </Button>
                  )}
                </div>

                {agentResult.n8nId && (
                  <Button
                    onClick={async () => {
                      try {
                        // Get user email from localStorage session
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
                        const headers: HeadersInit = {
                          'Content-Type': 'application/json',
                        };
                        if (userEmail) {
                          headers['x-user-email'] = userEmail;
                        }
                        
                        const passwordResponse = await fetch(`${baseUrl}/api/n8n/password`, {
                          headers,
                        });
                        
                        const passwordData = await passwordResponse.json();
                        
                        if (passwordResponse.ok && passwordData.password) {
                          const n8nBaseUrl = passwordData.n8nUrl || 'https://agents.avallon.ca';
                          const n8nLoginUrl = `${n8nBaseUrl}/login`;
                          const workflowUrl = `${n8nBaseUrl}/workflow/${agentResult.n8nId}`;
                          
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
                          const n8nBaseUrl = 'https://agents.avallon.ca';
                          window.open(`${n8nBaseUrl}/workflow/${agentResult.n8nId}`, '_blank', 'noopener,noreferrer');
                        }
                      } catch (error: any) {
                        console.error('Error getting password:', error);
                        alert(`Error: ${error.message || 'Failed to get password'}\n\nOpening n8n directly.`);
                        const n8nBaseUrl = 'https://agents.avallon.ca';
                        window.open(`${n8nBaseUrl}/workflow/${agentResult.n8nId}`, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in n8n Editor
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

