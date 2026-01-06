import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, ExternalLink, Code } from "lucide-react";

interface GenerationResult {
  website: {
    id: string;
    name: string;
    previewUrl: string;
    repoUrl?: string;
    files: number;
  };
  agent?: {
    id: string;
    name: string;
    n8nId: string;
    embedCode: string;
    webhookUrl: string;
  };
}

const AgentBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [style, setStyle] = useState<"modern" | "classic" | "minimalist" | "creative">("modern");
  const [framework, setFramework] = useState<"react" | "next">("react");
  const [createAgent, setCreateAgent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://beta-avallon.onrender.com';

  const generateWebsiteAndAgent = async () => {
    if (!prompt.trim() || prompt.length < 10) {
      toast({ 
        title: "Invalid Prompt", 
        description: "Please provide at least 10 characters describing your website",
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);
    setResult(null);
    
    try {
      const res = await fetch(`${baseUrl}/api/agents/generate-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          name: name || undefined,
          style,
          framework,
          createAgent,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to generate website');
      }

      setResult(data);
      toast({ 
        title: "Success!", 
        description: "Website and agent generated successfully",
      });
    } catch (e: any) {
      console.error('Generation error:', e);
      toast({ 
        title: "Error", 
        description: e.message || "Failed to generate website and agent", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyEmbedCode = () => {
    if (result?.agent?.embedCode) {
      navigator.clipboard.writeText(result.agent.embedCode);
      toast({ 
        title: "Copied!", 
        description: "Embed code copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Website Generator</h1>
          <p className="text-muted-foreground">
            Describe your website and we'll generate it using Lovable API, then create an n8n agent to help manage it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Generation Prompt</CardTitle>
            <CardDescription>
              Describe the website you want to create. Be as specific as possible for best results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Website Description</Label>
              <Textarea 
                id="prompt"
                rows={6} 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Example: Create a modern portfolio website for a photographer with a gallery, about section, and contact form. Use a dark theme with elegant typography."
                disabled={submitting}
              />
              <p className="text-xs text-muted-foreground">
                {prompt.length}/1000 characters (minimum 10)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website Name (Optional)</Label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Portfolio Website"
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Design Style</Label>
                <Select value={style} onValueChange={(v: any) => setStyle(v)} disabled={submitting}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select value={framework} onValueChange={(v: any) => setFramework(v)} disabled={submitting}>
                  <SelectTrigger id="framework">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="next">Next.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAgent}
                    onChange={(e) => setCreateAgent(e.target.checked)}
                    disabled={submitting}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Create n8n Agent</span>
                </label>
              </div>
            </div>

            <Button 
              onClick={generateWebsiteAndAgent} 
              disabled={submitting || prompt.length < 10}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Website...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-4 w-4" />
                  Generate Website & Agent
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Website Generated Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Website Name:</span>
                    <span>{result.website.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Files Generated:</span>
                    <span>{result.website.files} files</span>
                  </div>
                  {result.website.previewUrl && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Preview URL:</span>
                      <a 
                        href={result.website.previewUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        View Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {result.website.repoUrl && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Repository:</span>
                      <a 
                        href={result.website.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        View Code
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {result.agent && (
              <Card>
                <CardHeader>
                  <CardTitle>n8n Agent Created</CardTitle>
                  <CardDescription>
                    Your AI agent is ready to help manage and modify your website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Agent Name:</span>
                      <span>{result.agent.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Webhook URL:</span>
                      <a 
                        href={result.agent.webhookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {result.agent.webhookUrl}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Embed Code</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowEmbedCode(!showEmbedCode)}
                      >
                        {showEmbedCode ? 'Hide' : 'Show'} Code
                      </Button>
                    </div>
                    {showEmbedCode && (
                      <div className="relative">
                        <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                          {result.agent.embedCode}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={copyEmbedCode}
                        >
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentBuilder;

