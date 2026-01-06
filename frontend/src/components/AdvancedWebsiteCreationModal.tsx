// Advanced Website Creation Modal - Rivals Lovable, Bolt, and GPT
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Sparkles, Globe, Code, Zap, Settings, Palette, Layout, Target, Brain, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvancedWebsiteCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (site: any) => void;
}

const INDUSTRY_OPTIONS = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
  { value: 'consulting', label: 'Consulting', icon: '💼' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { value: 'fitness', label: 'Fitness', icon: '💪' },
];

const STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern', description: 'Clean, contemporary design' },
  { value: 'classic', label: 'Classic', description: 'Traditional, timeless look' },
  { value: 'minimalist', label: 'Minimalist', description: 'Simple, focused design' },
  { value: 'creative', label: 'Creative', description: 'Bold, artistic approach' },
  { value: 'professional', label: 'Professional', description: 'Corporate, business-focused' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated, luxury feel' },
];

const LAYOUT_OPTIONS = [
  { value: 'single-page', label: 'Single Page', description: 'All content on one page' },
  { value: 'multi-page', label: 'Multi Page', description: 'Multiple pages with navigation' },
  { value: 'blog', label: 'Blog', description: 'Content-focused with articles' },
  { value: 'ecommerce', label: 'E-commerce', description: 'Online store with products' },
  { value: 'portfolio', label: 'Portfolio', description: 'Showcase of work and projects' },
  { value: 'landing', label: 'Landing Page', description: 'Conversion-focused single page' },
];

const COMPLEXITY_OPTIONS = [
  { value: 'simple', label: 'Simple', description: 'Basic website with essential features' },
  { value: 'intermediate', label: 'Intermediate', description: 'Advanced features and interactions' },
  { value: 'advanced', label: 'Advanced', description: 'Complex functionality and integrations' },
  { value: 'enterprise', label: 'Enterprise', description: 'Full-scale business solution' },
];

const FEATURE_OPTIONS = [
  { value: 'contact-form', label: 'Contact Form', description: 'Lead generation and inquiries' },
  { value: 'blog', label: 'Blog', description: 'Content management and articles' },
  { value: 'ecommerce', label: 'E-commerce', description: 'Online store and payments' },
  { value: 'booking', label: 'Booking System', description: 'Appointment scheduling' },
  { value: 'membership', label: 'Membership', description: 'User accounts and login' },
  { value: 'analytics', label: 'Analytics', description: 'Performance tracking' },
  { value: 'seo', label: 'SEO Optimization', description: 'Search engine optimization' },
  { value: 'multilingual', label: 'Multilingual', description: 'Multiple language support' },
  { value: 'api-integration', label: 'API Integration', description: 'Third-party services' },
  { value: 'crm', label: 'CRM Integration', description: 'Customer relationship management' },
];

const EXAMPLE_PROMPTS = [
  "Create a modern tech startup website with dark theme, smooth animations, and a contact form",
  "Build an e-commerce store for handmade jewelry with product gallery, shopping cart, and secure checkout",
  "Design a restaurant website with online menu, reservation system, and location map",
  "Create a portfolio website for a graphic designer with project showcase and client testimonials",
  "Build a healthcare website with patient portal, appointment booking, and medical information",
  "Design a fitness website with class schedules, trainer profiles, and membership signup",
  "Create a real estate website with property listings, virtual tours, and agent profiles",
  "Build a consulting website with service packages, case studies, and client success stories"
];

export function AdvancedWebsiteCreationModal({ isOpen, onClose, onSuccess }: AdvancedWebsiteCreationModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Advanced parameters
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [layout, setLayout] = useState("");
  const [complexity, setComplexity] = useState("");
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [seo, setSeo] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [accessibility, setAccessibility] = useState(true);
  const [performance, setPerformance] = useState(true);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://beta-avallon.onrender.com' 
        : 'http://localhost:3000';
      
      const requestBody = {
        name: `Website ${Date.now()}`,
        description: prompt,
        mode: 'full',
        industry: industry || undefined,
        targetAudience: targetAudience || undefined,
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
        style: style || undefined,
        colorScheme: colorScheme || undefined,
        layout: layout || undefined,
        complexity: complexity || undefined,
        integrations: integrations.length > 0 ? integrations : undefined,
        seo,
        responsive,
        accessibility,
        performance,
      };

      const response = await fetch(`${baseUrl}/api/sites/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to start generation');
      }

      const result = await response.json();
      
      // Website generated with Kirin AI
      if (result.result) {
        onSuccess(result.result);
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

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-500" />
              Advanced AI Website Creator
            </CardTitle>
            <CardDescription>
              Create intelligent, professional websites with advanced AI
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Prompt
              </TabsTrigger>
              <TabsTrigger value="industry" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Industry
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="space-y-6">
              {/* Prompt Input */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium">
                  Describe your website in detail
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Be specific about your vision, target audience, key features, and desired outcomes..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="w-4 h-4" />
                  <span>AI will analyze your request and suggest optimal configurations.</span>
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
            </TabsContent>

            <TabsContent value="industry" className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-base font-medium">
                    Target Audience
                  </Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Small business owners, Tech professionals, Healthcare providers"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Complexity Level</Label>
                  <Select value={complexity} onValueChange={setComplexity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complexity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLEXITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Design Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Layout Type</Label>
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layout type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAYOUT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorScheme" className="text-base font-medium">
                    Color Scheme
                  </Label>
                  <Input
                    id="colorScheme"
                    placeholder="e.g., #2563eb, Blue and white, Modern gradient"
                    value={colorScheme}
                    onChange={(e) => setColorScheme(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Select Features</Label>
                <div className="grid grid-cols-2 gap-3">
                  {FEATURE_OPTIONS.map((feature) => (
                    <div
                      key={feature.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFeatures.includes(feature.value)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleFeatureToggle(feature.value)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedFeatures.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{feature.label}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Optimization Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seo"
                      checked={seo}
                      onCheckedChange={setSeo}
                    />
                    <Label htmlFor="seo" className="text-sm">
                      SEO Optimization
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="responsive"
                      checked={responsive}
                      onCheckedChange={setResponsive}
                    />
                    <Label htmlFor="responsive" className="text-sm">
                      Responsive Design
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accessibility"
                      checked={accessibility}
                      onCheckedChange={setAccessibility}
                    />
                    <Label htmlFor="accessibility" className="text-sm">
                      Accessibility Features
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="performance"
                      checked={performance}
                      onCheckedChange={setPerformance}
                    />
                    <Label htmlFor="performance" className="text-sm">
                      Performance Optimization
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Advanced Features Preview */}
          <div className="space-y-3">
            <Label className="text-base font-medium">What you'll get:</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <Code className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Advanced React/Next.js</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Live Website</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">AI-Generated</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Rocket className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Optimized</span>
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
                <div>🧠 Analyzing your requirements with AI</div>
                <div>⚡ Generating optimized React components</div>
                <div>🎨 Creating intelligent design system</div>
                <div>🚀 Implementing advanced features</div>
                <div>📊 Optimizing for performance and SEO</div>
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
                  Creating Advanced Website...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Create Advanced Website
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
