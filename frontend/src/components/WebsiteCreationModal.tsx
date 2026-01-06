import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Globe, Code, Zap } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WebsiteCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (site: any) => void;
}

const EXAMPLE_PROMPTS = [
  "Create a modern portfolio website for a graphic designer with dark theme and smooth animations",
  "Build an e-commerce store for handmade jewelry with product gallery and checkout",
  "Design a restaurant website with menu, reservations, and location map",
  "Create a tech startup landing page with pricing plans and contact form",
  "Build a blog website for a travel blogger with photo galleries and social links"
];

export function WebsiteCreationModal({ isOpen, onClose, onSuccess }: WebsiteCreationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/sites/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Website ${Date.now()}`,
          description: prompt,
          mode: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const result = await response.json();
      
      // Website generated with Kirin AI
      if (result.result) {
        // Include websiteContent in the result so preview can show immediately
        const siteWithContent = {
          ...result.result,
          websiteContent: result.websiteContent || {}
        };
        onSuccess(siteWithContent);
        toast({
          title: "Success!",
          description: result.message || "Website generated successfully with Kirin!",
        });
        setPrompt("");
        onClose();
      } else {
        throw new Error(result.error || 'Failed to generate website');
      }
    } catch (error: any) {
      console.error('Website generation failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start website generation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setSelectedExample(example);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Create Website with AI
            </CardTitle>
            <CardDescription>
              Describe your website and watch AI build it for you
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-base font-medium">
              What kind of website do you want to create?
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe your website in detail... (e.g., 'Create a modern portfolio website for a graphic designer with dark theme, smooth animations, and a contact form')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>Be specific for better results. Include style, features, and purpose.</span>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Or try these examples:</Label>
            <div className="grid gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <Button
                  key={index}
                  variant={selectedExample === example ? "default" : "outline"}
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => handleExampleClick(example)}
                  disabled={isGenerating}
                >
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{example}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What you'll get:</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <Code className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">React/Next.js Code</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Live Website</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">AI-Generated</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Local Preview</span>
              </div>
            </div>
          </div>

          {/* Generation Status */}
          {isGenerating && (
            <div className="space-y-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Generating your website...</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>🤖 Analyzing your prompt with AI</div>
                <div>⚡ Generating React components</div>
                <div>🎨 Creating beautiful designs</div>
                <div>🏠 Building your website in-house</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Website...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Website
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
