import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Check, ExternalLink, Key, CreditCard, MessageSquare, Mail, BarChart3, Bot } from 'lucide-react';

interface Integration {
  id: string;
  provider: string;
  status: string;
  metadata?: Record<string, any>;
  connectedAt: string;
  lastUsedAt?: string;
  providerInfo?: {
    name: string;
    description: string;
    icon: string;
    requiredFields: string[];
    optionalFields: string[];
    docsUrl: string;
  };
}

interface AvailableProvider {
  provider: string;
  name: string;
  description: string;
  icon: string;
  requiredFields: string[];
  optionalFields: string[];
  docsUrl: string;
  status: string;
}

const providerIcons: Record<string, React.ReactNode> = {
  stripe: <CreditCard className="w-6 h-6 text-purple-500" />,
  twilio: <MessageSquare className="w-6 h-6 text-red-500" />,
  sendgrid: <Mail className="w-6 h-6 text-blue-500" />,
  google_analytics: <BarChart3 className="w-6 h-6 text-orange-500" />,
  openai: <Bot className="w-6 h-6 text-green-500" />,
};

const fieldLabels: Record<string, string> = {
  secretKey: 'Secret Key',
  publishableKey: 'Publishable Key',
  webhookSecret: 'Webhook Secret',
  accountSid: 'Account SID',
  authToken: 'Auth Token',
  phoneNumber: 'Phone Number',
  apiKey: 'API Key',
  fromEmail: 'From Email',
  fromName: 'From Name',
  measurementId: 'Measurement ID',
};

const fieldPlaceholders: Record<string, string> = {
  secretKey: 'sk_live_...',
  publishableKey: 'pk_live_...',
  webhookSecret: 'whsec_...',
  accountSid: 'AC...',
  authToken: 'Your auth token',
  phoneNumber: '+1234567890',
  apiKey: 'Your API key',
  fromEmail: 'hello@yourdomain.com',
  fromName: 'Your Company',
  measurementId: 'G-XXXXXXXXXX',
};

export function IntegrationsManager() {
  const [connected, setConnected] = useState<Integration[]>([]);
  const [available, setAvailable] = useState<AvailableProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AvailableProvider | null>(null);
  const [skipValidation, setSkipValidation] = useState(false);
  const { toast } = useToast();

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.PROD ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      
      // Use fetchWithAuth for proper authentication
      const { fetchWithAuth } = await import('@/lib/fetchWithAuth');
      const response = await fetchWithAuth(`${baseUrl}/api/integrations`, {
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Integrations fetched:', { 
          connected: data.connected?.length || 0, 
          available: data.available?.length || 0,
          availableProviders: data.available?.map((a: any) => a.provider) || [],
          fullData: data
        });
        setConnected(data.connected || []);
        setAvailable(data.available || []);
        
        // If no available integrations returned, show fallback list
        if (!data.available || data.available.length === 0) {
          console.warn('⚠️ No available integrations returned from API, using fallback');
          // Fallback: show all providers if API doesn't return them
          const fallbackProviders = [
            { provider: 'stripe', name: 'Stripe', description: 'Accept payments on your website', icon: '💳', requiredFields: ['secretKey', 'publishableKey'], optionalFields: ['webhookSecret'], docsUrl: 'https://stripe.com/docs/keys', status: 'not_connected' },
            { provider: 'twilio', name: 'Twilio', description: 'SMS and voice communications', icon: '📱', requiredFields: ['accountSid', 'authToken'], optionalFields: ['phoneNumber'], docsUrl: 'https://www.twilio.com/docs/usage/api', status: 'not_connected' },
            { provider: 'sendgrid', name: 'SendGrid', description: 'Email delivery service', icon: '📧', requiredFields: ['apiKey'], optionalFields: ['fromEmail', 'fromName'], docsUrl: 'https://docs.sendgrid.com/ui/account-and-settings/api-keys', status: 'not_connected' },
            { provider: 'google_analytics', name: 'Google Analytics', description: 'Website analytics and tracking', icon: '📊', requiredFields: ['measurementId'], optionalFields: [], docsUrl: 'https://support.google.com/analytics/answer/9539598', status: 'not_connected' },
            { provider: 'openai', name: 'OpenAI', description: 'AI-powered features for your website', icon: '🤖', requiredFields: ['apiKey'], optionalFields: [], docsUrl: 'https://platform.openai.com/api-keys', status: 'not_connected' },
          ];
          setAvailable(fallbackProviders);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Failed to fetch integrations:', errorData, response.status);
        toast({
          title: 'Error',
          description: errorData.error || `Failed to load integrations (${response.status})`,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch integrations:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load integrations. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnect = async () => {
    if (!selectedProvider) return;

    setConnectingProvider(selectedProvider.provider);

    try {
      const baseUrl = import.meta.env.PROD ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      const { fetchWithAuth } = await import('@/lib/fetchWithAuth');
      const response = await fetchWithAuth(`${baseUrl}/api/integrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          provider: selectedProvider.provider,
          credentials,
          skipValidation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '✅ Integration Connected!',
          description: `${selectedProvider.name} is now connected. Your API keys will be automatically used in all new websites you generate.`,
          duration: 5000,
        });
        setDialogOpen(false);
        setCredentials({});
        setSelectedProvider(null);
        setSkipValidation(false);
        fetchIntegrations();
      } else {
        // Show error with hint if available
        const errorMsg = data.error || 'Failed to connect integration';
        const hintMsg = data.hint ? `\n\n${data.hint}` : '';
        toast({
          title: 'Connection Failed',
          description: errorMsg + hintMsg,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect integration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const baseUrl = import.meta.env.PROD ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      const { fetchWithAuth } = await import('@/lib/fetchWithAuth');
      const response = await fetchWithAuth(`${baseUrl}/api/integrations?provider=${provider}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Integration Disconnected',
          description: 'The integration has been removed.',
        });
        fetchIntegrations();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to disconnect integration',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect integration',
        variant: 'destructive',
      });
    }
  };

  const openConnectDialog = (provider: AvailableProvider) => {
    setSelectedProvider(provider);
    setCredentials({});
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Connected Integrations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-500" />
          Connected Integrations
        </h3>
        
        {connected.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              No integrations connected yet. Connect an integration to enable features in your websites.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connected.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {providerIcons[integration.provider] || <Key className="w-6 h-6" />}
                      <div>
                        <CardTitle className="text-base">
                          {integration.providerInfo?.name || integration.provider}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {integration.metadata?.accountName || integration.metadata?.accountEmail || 'Connected'}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Connected {new Date(integration.connectedAt).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDisconnect(integration.provider)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Integrations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Available Integrations
          </h3>
        </div>

        {/* How It Works Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Key className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">How to Add Your API Keys</h4>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Click "Connect" on any integration below</li>
                  <li>Click "Get API Keys" to open the provider's documentation</li>
                  <li>Copy your API keys from your provider account</li>
                  <li>Paste them into the form and click "Connect"</li>
                  <li>Your keys are encrypted and automatically used in generated websites!</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {available.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                {loading ? 'Loading integrations...' : 'No integrations available. Please refresh the page.'}
              </p>
              {!loading && (
                <Button variant="outline" onClick={fetchIntegrations}>
                  Refresh
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {available.map((provider) => (
              <Card key={provider.provider} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => openConnectDialog(provider)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    {providerIcons[provider.provider] || <Key className="w-6 h-6" />}
                    <div>
                      <CardTitle className="text-base">{provider.name}</CardTitle>
                      <CardDescription className="text-xs">{provider.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Get API Keys
                    </a>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      openConnectDialog(provider);
                    }}>
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Connect Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProvider && providerIcons[selectedProvider.provider]}
              Connect {selectedProvider?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your {selectedProvider?.name} API credentials below. 
              Your keys are encrypted and stored securely. They will be automatically 
              used in all websites you generate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 Tip:</strong> Don't have API keys? Click "Get API Keys" below to 
                learn how to create them in your {selectedProvider?.name} account.
              </p>
            </div>

            {selectedProvider?.requiredFields.map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {fieldLabels[field] || field} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field}
                  type={field.toLowerCase().includes('key') || field.toLowerCase().includes('secret') || field.toLowerCase().includes('token') ? 'password' : 'text'}
                  placeholder={fieldPlaceholders[field] || `Enter ${field}`}
                  value={credentials[field] || ''}
                  onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {field === 'secretKey' && 'Find this in Stripe Dashboard → Developers → API Keys'}
                  {field === 'publishableKey' && 'Find this in Stripe Dashboard → Developers → API Keys'}
                  {field === 'accountSid' && 'Find this in Twilio Console → Account Info'}
                  {field === 'authToken' && 'Find this in Twilio Console → Account Info'}
                  {field === 'apiKey' && `Find this in your ${selectedProvider?.name} dashboard or settings`}
                  {field === 'measurementId' && 'Find this in Google Analytics → Admin → Data Streams'}
                </p>
              </div>
            ))}

            {selectedProvider?.optionalFields.map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-muted-foreground">
                  {fieldLabels[field] || field} (optional)
                </Label>
                <Input
                  id={field}
                  type="text"
                  placeholder={fieldPlaceholders[field] || `Enter ${field}`}
                  value={credentials[field] || ''}
                  onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                />
              </div>
            ))}

            {/* Skip validation option for restricted keys */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="skipValidation"
                checked={skipValidation}
                onChange={(e) => setSkipValidation(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="skipValidation" className="text-sm text-muted-foreground cursor-pointer">
                Skip API validation (use for restricted keys)
              </Label>
            </div>

            <div className="pt-2 border-t">
              <a
                href={selectedProvider?.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Get API Keys from {selectedProvider?.name} →
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Opens in a new tab with step-by-step instructions
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={
                connectingProvider === selectedProvider?.provider ||
                !selectedProvider?.requiredFields.every((field) => credentials[field])
              }
            >
              {connectingProvider === selectedProvider?.provider ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IntegrationsManager;


