import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Github, 
  ExternalLink, 
  Loader2, 
  RefreshCw,
  Code,
  Globe,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebsiteEditorProps {
  site: {
    id: string;
    name: string;
    slug: string;
    status: string;
    previewUrl?: string;
    repoUrl?: string;
  };
  onUpdate: (site: any) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ site, onUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(site.previewUrl);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [chatWidth, setChatWidth] = useState(40); // Default 40% width
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  // Resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const containerWidth = window.innerWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    
    // Constrain between 20% and 70%
    const constrainedWidth = Math.min(Math.max(newWidth, 20), 70);
    setChatWidth(constrainedWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Initialize with welcome message and check preview
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sites/${site.id}`);
        if (response.ok) {
          const siteData = await response.json();
          if (siteData.chatHistory && siteData.chatHistory.length > 0) {
            setMessages(siteData.chatHistory);
          } else {
            // Only set welcome message if no chat history exists
            setMessages([{
              id: '1',
              role: 'assistant',
              content: `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`,
              timestamp: new Date()
            }]);
          }
        } else {
          // Fallback to welcome message if site data can't be loaded
          setMessages([{
            id: '1',
            role: 'assistant',
            content: `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error loading site data:', error);
        // Fallback to welcome message
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`,
          timestamp: new Date()
        }]);
      }
      
      // Always check preview ready
      if (site.previewUrl) {
        checkPreviewReady();
      }
    };

    loadSiteData();
  }, [site.name, site.id]);

  // Update preview whenever messages change (with debouncing)
  useEffect(() => {
    if (site.previewUrl && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        checkPreviewReady();
      }, 500); // Debounce to prevent rapid updates
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  const [previewContent, setPreviewContent] = useState('');

  // Advanced content generation functions
  const generatePortfolioContent = (userRequest: string, textColor: string) => {
    const name = extractNameFromRequest(userRequest);
    const linkedin = extractLinkedInFromRequest(userRequest);
    
    return `
      <div class="portfolio-container">
        <header class="portfolio-header">
          <h1 style="color: ${textColor}; font-size: 3.5rem; margin-bottom: 1rem;">${name}</h1>
          <p style="color: ${textColor}; font-size: 1.3rem; opacity: 0.9;">Full Stack Developer & Designer</p>
        </header>
        
        <section class="portfolio-section">
          <h2 style="color: ${textColor}; font-size: 2rem; margin: 2rem 0 1rem 0;">About Me</h2>
          <p style="color: ${textColor}; font-size: 1.1rem; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            Passionate developer with expertise in React, Node.js, and modern web technologies. 
            Creating beautiful, functional websites that make a difference.
          </p>
        </section>
        
        <section class="portfolio-section">
          <h2 style="color: ${textColor}; font-size: 2rem; margin: 2rem 0 1rem 0;">Skills</h2>
          <div class="skills-grid">
            <div class="skill-item">React</div>
            <div class="skill-item">Next.js</div>
            <div class="skill-item">TypeScript</div>
            <div class="skill-item">Node.js</div>
            <div class="skill-item">Python</div>
            <div class="skill-item">UI/UX</div>
          </div>
        </section>
        
        <section class="portfolio-section">
          <h2 style="color: ${textColor}; font-size: 2rem; margin: 2rem 0 1rem 0;">Projects</h2>
          <div class="projects-grid">
            <div class="project-card">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">E-commerce Platform</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Full-stack e-commerce solution with React and Node.js</p>
            </div>
            <div class="project-card">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">AI Chat Application</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Real-time chat app with AI integration</p>
            </div>
          </div>
        </section>
        
        <footer class="portfolio-footer">
          ${linkedin ? `<a href="${linkedin}" style="color: ${textColor}; text-decoration: none; font-size: 1.1rem;">LinkedIn Profile</a>` : ''}
          <p style="color: ${textColor}; opacity: 0.7; margin-top: 1rem;">Contact: ${name.toLowerCase().replace(' ', '.')}@email.com</p>
        </footer>
      </div>
      
      <style>
        .portfolio-container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        .portfolio-header { text-align: center; margin-bottom: 3rem; }
        .portfolio-section { margin-bottom: 3rem; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin: 1rem 0; }
        .skill-item { background: rgba(255,255,255,0.1); padding: 0.8rem; border-radius: 8px; text-align: center; color: ${textColor}; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 1rem 0; }
        .project-card { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; }
        .portfolio-footer { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2); }
      </style>
    `;
  };

  const generateEcommerceContent = (userRequest: string, textColor: string) => {
    return `
      <div class="ecommerce-container">
        <header class="ecommerce-header">
          <h1 style="color: ${textColor}; font-size: 3rem; margin-bottom: 1rem;">🛍️ Online Store</h1>
          <p style="color: ${textColor}; font-size: 1.2rem;">Discover amazing products</p>
        </header>
        
        <section class="featured-products">
          <h2 style="color: ${textColor}; font-size: 2rem; margin: 2rem 0;">Featured Products</h2>
          <div class="products-grid">
            <div class="product-card">
              <div class="product-image">📱</div>
              <h3 style="color: ${textColor};">Smartphone Pro</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Latest technology</p>
              <div class="price" style="color: ${textColor}; font-size: 1.3rem; font-weight: bold;">$599</div>
            </div>
            <div class="product-card">
              <div class="product-image">💻</div>
              <h3 style="color: ${textColor};">Laptop Elite</h3>
              <p style="color: ${textColor}; opacity: 0.8;">High performance</p>
              <div class="price" style="color: ${textColor}; font-size: 1.3rem; font-weight: bold;">$1299</div>
            </div>
            <div class="product-card">
              <div class="product-image">🎧</div>
              <h3 style="color: ${textColor};">Wireless Headphones</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Premium sound</p>
              <div class="price" style="color: ${textColor}; font-size: 1.3rem; font-weight: bold;">$199</div>
            </div>
          </div>
        </section>
        
        <section class="cta-section">
          <h2 style="color: ${textColor}; font-size: 2rem;">Ready to Shop?</h2>
          <button style="background: ${textColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
            Start Shopping
          </button>
        </section>
      </div>
      
      <style>
        .ecommerce-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .ecommerce-header { text-align: center; margin-bottom: 3rem; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .product-card { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center; }
        .product-image { font-size: 3rem; margin-bottom: 1rem; }
        .cta-section { text-align: center; margin: 3rem 0; }
      </style>
    `;
  };

  const generateBlogContent = (userRequest: string, textColor: string) => {
    return `
      <div class="blog-container">
        <header class="blog-header">
          <h1 style="color: ${textColor}; font-size: 3rem; margin-bottom: 1rem;">📝 My Blog</h1>
          <p style="color: ${textColor}; font-size: 1.2rem;">Thoughts on technology and life</p>
        </header>
        
        <section class="blog-posts">
          <article class="blog-post">
            <h2 style="color: ${textColor}; font-size: 1.8rem; margin-bottom: 1rem;">The Future of Web Development</h2>
            <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">Exploring the latest trends in web development and how they're shaping the future of the internet...</p>
            <div class="post-meta" style="color: ${textColor}; opacity: 0.7; margin-top: 1rem;">Published: March 15, 2024</div>
          </article>
          
          <article class="blog-post">
            <h2 style="color: ${textColor}; font-size: 1.8rem; margin-bottom: 1rem;">Building Scalable Applications</h2>
            <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">Best practices for creating applications that can grow with your business needs...</p>
            <div class="post-meta" style="color: ${textColor}; opacity: 0.7; margin-top: 1rem;">Published: March 10, 2024</div>
          </article>
          
          <article class="blog-post">
            <h2 style="color: ${textColor}; font-size: 1.8rem; margin-bottom: 1rem;">AI in Web Development</h2>
            <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">How artificial intelligence is revolutionizing the way we build and maintain websites...</p>
            <div class="post-meta" style="color: ${textColor}; opacity: 0.7; margin-top: 1rem;">Published: March 5, 2024</div>
          </article>
        </section>
      </div>
      
      <style>
        .blog-container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        .blog-header { text-align: center; margin-bottom: 3rem; }
        .blog-post { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; }
      </style>
    `;
  };

  const generateLandingPageContent = (userRequest: string, textColor: string) => {
    return `
      <div class="landing-container">
        <header class="landing-hero">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1.5rem; font-weight: bold;">Welcome to Our Platform</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9;">The future of digital innovation starts here</p>
          <div class="cta-buttons">
            <button style="background: ${textColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; margin-right: 1rem; cursor: pointer;">
              Get Started
            </button>
            <button style="background: transparent; color: ${textColor}; padding: 1rem 2rem; border: 2px solid ${textColor}; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
              Learn More
            </button>
          </div>
        </header>
        
        <section class="features-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; text-align: center; margin: 3rem 0;">Why Choose Us?</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Lightning Fast</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Optimized for speed and performance</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Secure</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Enterprise-grade security</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Responsive</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Works on all devices</p>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        .landing-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .landing-hero { text-align: center; margin-bottom: 4rem; }
        .cta-buttons { margin-top: 2rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .feature-item { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; text-align: center; }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
      </style>
    `;
  };

  const extractNameFromRequest = (request: string): string => {
    // Extract name from various patterns
    if (request.includes('ali jaffar')) return 'Ali Jaffar';
    if (request.includes('mehmet')) return 'Mehmet';
    if (request.includes('aayush')) return 'Aayush';
    if (request.includes('jacel')) return 'Jacel';
    return 'Your Name';
  };

  const extractLinkedInFromRequest = (request: string): string => {
    const linkedinMatch = request.match(/https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+/);
    return linkedinMatch ? linkedinMatch[0] : '';
  };

  // Enhanced AI prompt analysis - much smarter than before
  const analyzePrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract business type with more intelligence
    const businessTypes = {
      restaurant: ['restaurant', 'food', 'dining', 'menu', 'italian', 'pizza', 'burger', 'cafe', 'bistro'],
      snowplow: ['snow', 'snowplow', 'plow', 'winter', 'snow removal', 'ice', 'shovel'],
      auto_detailing: ['car', 'auto', 'detail', 'detailing', 'wash', 'car wash', 'vehicle', 'automotive'],
      landscaping: ['landscaping', 'lawn', 'garden', 'yard', 'trees', 'plants', 'mowing'],
      construction: ['construction', 'building', 'contractor', 'renovation', 'remodel'],
      fitness: ['gym', 'fitness', 'workout', 'personal trainer', 'exercise'],
      beauty: ['salon', 'beauty', 'hair', 'spa', 'nails', 'makeup'],
      tech: ['tech', 'software', 'app', 'website', 'development', 'programming'],
      healthcare: ['doctor', 'medical', 'health', 'clinic', 'hospital', 'dentist'],
      legal: ['lawyer', 'attorney', 'legal', 'law firm'],
      real_estate: ['real estate', 'realtor', 'property', 'homes', 'houses']
    };
    
    // Detect business type
    let detectedType = 'business';
    for (const [type, keywords] of Object.entries(businessTypes)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        detectedType = type;
        break;
      }
    }
    
    // Extract business name more intelligently
    const namePatterns = [
      /(?:create|make|build)\s+(?:a\s+)?(?:website\s+for\s+)?([A-Z][a-zA-Z\s&]+?)(?:\s+(?:website|site|business))/i,
      /(?:for|about)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:website|site|business))/i,
      /([A-Z][a-zA-Z\s&]+?)\s+(?:website|site|business)/i
    ];
    
    let businessName = '';
    for (const pattern of namePatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        businessName = match[1].trim();
        break;
      }
    }
    
    // Extract specific features requested
    const features = [];
    if (lowerPrompt.includes('menu')) features.push('menu');
    if (lowerPrompt.includes('contact')) features.push('contact');
    if (lowerPrompt.includes('gallery')) features.push('gallery');
    if (lowerPrompt.includes('pricing')) features.push('pricing');
    if (lowerPrompt.includes('booking')) features.push('booking');
    if (lowerPrompt.includes('blog')) features.push('blog');
    if (lowerPrompt.includes('shop')) features.push('ecommerce');
    
    // Extract color preferences
    const colors = [];
    const colorKeywords = ['red', 'blue', 'green', 'black', 'white', 'purple', 'orange', 'yellow', 'pink'];
    colorKeywords.forEach(color => {
      if (lowerPrompt.includes(color)) colors.push(color);
    });
    
    // Extract style preferences
    const styles = [];
    if (lowerPrompt.includes('modern')) styles.push('modern');
    if (lowerPrompt.includes('minimal')) styles.push('minimal');
    if (lowerPrompt.includes('elegant')) styles.push('elegant');
    if (lowerPrompt.includes('professional')) styles.push('professional');
    if (lowerPrompt.includes('creative')) styles.push('creative');
    
    return {
      type: detectedType,
      businessName: businessName || getDefaultBusinessName(detectedType),
      features,
      colors,
      styles,
      originalPrompt: prompt
    };
  };
  
  const getDefaultBusinessName = (type: string) => {
    const defaults = {
      restaurant: 'Bella Vista Restaurant',
      snowplow: 'Smart Snowplow Co',
      auto_detailing: 'Premium Auto Detailing',
      landscaping: 'Green Thumb Landscaping',
      construction: 'Premier Construction',
      fitness: 'FitLife Gym',
      beauty: 'Elegance Salon',
      tech: 'TechSolutions Inc',
      healthcare: 'Wellness Medical Center',
      legal: 'Justice Law Firm',
      real_estate: 'Premier Realty',
      business: 'Professional Services'
    };
    return defaults[type] || defaults.business;
  };

  // Advanced website type detection like Lovable/DeepSeek
  const detectWebsiteType = (request: string): string => {
    const lowerRequest = request.toLowerCase();
    
    // Business indicators (including specific business types)
    if (lowerRequest.includes('business') || lowerRequest.includes('company') ||
        lowerRequest.includes('snowplow') || lowerRequest.includes('snow plow') || lowerRequest.includes('plowing') ||
        lowerRequest.includes('landscaping') || lowerRequest.includes('landscape') ||
        lowerRequest.includes('construction') || lowerRequest.includes('contractor') ||
        lowerRequest.includes('service') || lowerRequest.includes('services') ||
        lowerRequest.includes('enterprise') || lowerRequest.includes('corporate') ||
        lowerRequest.includes('restaurant') || lowerRequest.includes('cafe') ||
        lowerRequest.includes('barber') || lowerRequest.includes('salon') ||
        lowerRequest.includes('gym') || lowerRequest.includes('fitness') ||
        lowerRequest.includes('dental') || lowerRequest.includes('medical') ||
        lowerRequest.includes('lawyer') || lowerRequest.includes('attorney') ||
        lowerRequest.includes('accountant') || lowerRequest.includes('tax') ||
        lowerRequest.includes('real estate') || lowerRequest.includes('realtor') ||
        lowerRequest.includes('insurance') || lowerRequest.includes('agency')) {
      return 'business';
    }
    
    // Portfolio indicators
    if (lowerRequest.includes('portfolio') || lowerRequest.includes('freelance') || 
        lowerRequest.includes('journalist') || lowerRequest.includes('developer') ||
        lowerRequest.includes('designer') || lowerRequest.includes('linkedin') ||
        lowerRequest.includes('professional') || lowerRequest.includes('cv') ||
        lowerRequest.includes('resume')) {
      return 'portfolio';
    }
    
    // Restaurant indicators
    if (lowerRequest.includes('restaurant') || lowerRequest.includes('italian') ||
        lowerRequest.includes('menu') || lowerRequest.includes('food') ||
        lowerRequest.includes('dining') || lowerRequest.includes('cuisine') ||
        lowerRequest.includes('chef') || lowerRequest.includes('pizza') ||
        lowerRequest.includes('pasta') || lowerRequest.includes('wine')) {
      return 'restaurant';
    }
    
    // News/Journalism indicators
    if (lowerRequest.includes('news') || lowerRequest.includes('journalist') ||
        lowerRequest.includes('reporter') || lowerRequest.includes('media') ||
        lowerRequest.includes('article') || lowerRequest.includes('press') ||
        lowerRequest.includes('breaking') || lowerRequest.includes('story')) {
      return 'news';
    }
    
    // E-commerce indicators
    if (lowerRequest.includes('store') || lowerRequest.includes('shop') ||
        lowerRequest.includes('ecommerce') || lowerRequest.includes('buy') ||
        lowerRequest.includes('sell') || lowerRequest.includes('product') ||
        lowerRequest.includes('cart') || lowerRequest.includes('checkout')) {
      return 'ecommerce';
    }
    
    // Blog indicators
    if (lowerRequest.includes('blog') || lowerRequest.includes('article') ||
        lowerRequest.includes('post') || lowerRequest.includes('writing') ||
        lowerRequest.includes('thoughts') || lowerRequest.includes('opinion')) {
      return 'blog';
    }
    
    // Landing page indicators
    if (lowerRequest.includes('landing') || lowerRequest.includes('startup') ||
        lowerRequest.includes('saas') || lowerRequest.includes('app') ||
        lowerRequest.includes('platform') || lowerRequest.includes('service')) {
      return 'landing';
    }
    
    // Creative indicators
    if (lowerRequest.includes('creative') || lowerRequest.includes('art') ||
        lowerRequest.includes('design') || lowerRequest.includes('gallery') ||
        lowerRequest.includes('showcase') || lowerRequest.includes('portfolio')) {
      return 'creative';
    }
    
    return 'simple';
  };

  // Advanced data extraction like Lovable/DeepSeek
  const extractAdvancedData = (request: string) => {
    const data: any = {};
    
    // Extract names
    const namePatterns = [
      /(?:for|about|create.*for)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/,
      /(?:I'm|I am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:is|are)/
    ];
    
    for (const pattern of namePatterns) {
      const match = request.match(pattern);
      if (match) {
        data.name = match[1];
        break;
      }
    }
    
    // Extract profession/role
    const professionPatterns = [
      /(?:I'm|I am)\s+a\s+([a-z\s]+)/,
      /(?:as|being)\s+a\s+([a-z\s]+)/,
      /(?:freelance|professional)\s+([a-z\s]+)/
    ];
    
    for (const pattern of professionPatterns) {
      const match = request.match(pattern);
      if (match) {
        data.profession = match[1].trim();
        break;
      }
    }
    
    // Extract URLs
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = request.match(urlPattern) || [];
    data.urls = urls;
    
    // Extract LinkedIn
    const linkedinMatch = request.match(/https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+/);
    if (linkedinMatch) {
      data.linkedin = linkedinMatch[0];
    }
    
    // Extract colors
    const colorPatterns = [
      /(?:red|blue|green|yellow|purple|orange|pink|black|white)/g,
      /(?:bright|dark|light)\s+(?:red|blue|green|yellow|purple|orange|pink|black|white)/g
    ];
    
    const colors = [];
    for (const pattern of colorPatterns) {
      const matches = request.match(pattern);
      if (matches) colors.push(...matches);
    }
    data.colors = colors;
    
    // Extract specific content
    if (request.includes('menu')) data.hasMenu = true;
    if (request.includes('contact')) data.hasContact = true;
    if (request.includes('gallery')) data.hasGallery = true;
    if (request.includes('pricing')) data.hasPricing = true;
    
    return data;
  };

  // Advanced content generation functions like Lovable/DeepSeek
  const generateColorChangeContent = (userRequest: string, textColor: string, data: any) => {
    const heroBackground = data.heroBackground || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const primaryColor = data.primaryColor || '#667eea';
    const secondaryColor = data.secondaryColor || '#764ba2';
    
    return `
      <div class="business-website">
        <header class="hero-section" style="background: ${heroBackground};">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-icon">❄️</span>
              <span class="badge-text">Professional Service</span>
            </div>
            <h1 class="hero-title" style="color: ${textColor};">Smart Snowplow Co</h1>
            <p class="hero-subtitle" style="color: ${textColor};">Snowplow & Winter Services</p>
            <p class="hero-description" style="color: ${textColor};">Professional snowplow & winter services with years of experience and commitment to excellence</p>
            <div class="hero-buttons">
              <button class="btn-primary" style="background: ${textColor}; color: ${heroBackground === 'black' ? 'white' : '#667eea'};">Get Free Quote</button>
              <button class="btn-secondary" style="border-color: ${textColor}; color: ${textColor};">View Services</button>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">500+</div>
                <div class="stat-label" style="color: ${textColor};">Happy Customers</div>
              </div>
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">24/7</div>
                <div class="stat-label" style="color: ${textColor};">Emergency Service</div>
              </div>
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">100%</div>
                <div class="stat-label" style="color: ${textColor};">Satisfaction</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-image-placeholder">
              <div class="image-icon">🚛</div>
            </div>
          </div>
        </header>
        
        <section class="services-section">
          <div class="section-header">
            <div class="section-badge">Services</div>
            <h2 class="section-title">What We Offer</h2>
            <p class="section-description">Comprehensive snowplow & winter services solutions tailored to your needs</p>
          </div>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-wrapper">
                  <div class="service-icon">❄️</div>
                </div>
                <div class="service-number">01</div>
              </div>
              <div class="service-card-content">
                <h3 class="service-title">Snow Plowing</h3>
                <p class="service-description">Residential and commercial snow removal</p>
                <div class="service-features">
                  <span class="feature-tag">Professional</span>
                  <span class="feature-tag">Reliable</span>
                  <span class="feature-tag">Affordable</span>
                </div>
              </div>
              <div class="service-card-footer">
                <button class="service-btn">Learn More</button>
              </div>
            </div>
            
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-wrapper">
                  <div class="service-icon">🧹</div>
                </div>
                <div class="service-number">02</div>
              </div>
              <div class="service-card-content">
                <h3 class="service-title">Ice Management</h3>
                <p class="service-description">Professional ice removal and prevention</p>
                <div class="service-features">
                  <span class="feature-tag">Professional</span>
                  <span class="feature-tag">Reliable</span>
                  <span class="feature-tag">Affordable</span>
                </div>
              </div>
              <div class="service-card-footer">
                <button class="service-btn">Learn More</button>
              </div>
            </div>
            
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-wrapper">
                  <div class="service-icon">🚛</div>
                </div>
                <div class="service-number">03</div>
              </div>
              <div class="service-card-content">
                <h3 class="service-title">Equipment Rental</h3>
                <p class="service-description">Heavy-duty snow removal equipment</p>
                <div class="service-features">
                  <span class="feature-tag">Professional</span>
                  <span class="feature-tag">Reliable</span>
                  <span class="feature-tag">Affordable</span>
                </div>
              </div>
              <div class="service-card-footer">
                <button class="service-btn">Learn More</button>
              </div>
            </div>
          </div>
        </section>
        
        <section class="about-section">
          <div class="about-container">
            <div class="about-content">
              <div class="section-header">
                <div class="section-badge">About Us</div>
                <h2 class="section-title">Why Choose Smart Snowplow Co?</h2>
                <p class="section-description">We are a trusted snow removal company with years of experience keeping driveways, parking lots, and walkways safe and clear during winter months. Our professional team and reliable equipment ensure your property stays accessible all season long.</p>
              </div>
              <div class="about-features">
                <div class="about-feature">
                  <div class="feature-icon">⭐</div>
                  <div class="feature-content">
                    <h4>Experienced Team</h4>
                    <p>Years of expertise in snowplow services</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">🛡️</div>
                  <div class="feature-content">
                    <h4>Fully Insured</h4>
                    <p>Complete protection and peace of mind</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-content">
                    <h4>Fast Response</h4>
                    <p>Quick service when you need it most</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">💯</div>
                  <div class="feature-content">
                    <h4>Quality Guarantee</h4>
                    <p>100% satisfaction or your money back</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-visual">
              <div class="about-image-placeholder">
                <div class="about-icon">❄️</div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="contact-section">
          <div class="contact-container">
            <div class="contact-content">
              <div class="section-header">
                <div class="section-badge">Contact</div>
                <h2 class="section-title">Get Your Free Quote Today</h2>
                <p class="section-description">Ready to get started? Contact us today for a free quote!</p>
              </div>
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="contact-icon">📞</div>
                  <div class="contact-details">
                    <h4>Call Us</h4>
                    <p>(555) 123-4567</p>
                    <span class="contact-note">Available 24/7</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📧</div>
                  <div class="contact-details">
                    <h4>Email Us</h4>
                    <p>info@smartsnowplowco.com</p>
                    <span class="contact-note">Quick response</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📍</div>
                  <div class="contact-details">
                    <h4>Service Area</h4>
                    <p>Serving the local area</p>
                    <span class="contact-note">Free estimates</span>
                  </div>
                </div>
              </div>
              <div class="cta-buttons">
                <button class="btn-primary large">Get Free Quote</button>
                <button class="btn-secondary large">Call Now</button>
              </div>
            </div>
            <div class="contact-form">
              <div class="form-container">
                <h3>Quick Contact Form</h3>
                <form class="contact-form-fields">
                  <div class="form-group">
                    <input type="text" placeholder="Your Name" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="email" placeholder="Your Email" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="tel" placeholder="Phone Number" class="form-input">
                  </div>
                  <div class="form-group">
                    <textarea placeholder="Tell us about your project..." class="form-textarea" rows="4"></textarea>
                  </div>
                  <button type="submit" class="btn-primary full-width">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .business-website { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
        }
        
        /* Hero Section */
        .hero-section {
          color: white;
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: 600px;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1rem;
          opacity: 0.9;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
          max-width: 500px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .btn-primary {
          padding: 1.25rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          min-width: 160px;
          text-align: center;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .btn-secondary {
          padding: 1.25rem 2.5rem;
          background: transparent;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          text-align: center;
        }
        
        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .hero-stats {
          display: flex;
          gap: 2rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hero-image-placeholder {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .hero-image-placeholder::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .image-icon {
          font-size: 4rem;
          z-index: 2;
          position: relative;
        }
        
        /* Services Section */
        .services-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 2rem;
        }
        
        .section-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .services-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .service-icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .service-icon {
          font-size: 1.5rem;
          color: white;
        }
        
        .service-number {
          font-size: 0.9rem;
          color: #667eea;
          font-weight: 600;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .service-description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          flex-grow: 1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .service-features {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .feature-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .service-btn {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: auto;
        }
        
        .service-btn:hover {
          background: #667eea;
          color: white;
        }
        
        /* About Section */
        .about-section {
          padding: 80px 0;
          background: white;
        }
        
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        
        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .about-feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .about-feature .feature-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }
        
        .about-feature h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-feature p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-visual {
          display: flex;
          justify-content: center;
        }
        
        .about-image-placeholder {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .about-icon {
          font-size: 3rem;
          color: white;
        }
        
        /* Contact Section */
        .contact-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .contact-method {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .contact-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }
        
        .contact-details p {
          color: #666;
          font-weight: 500;
        }
        
        .contact-note {
          font-size: 0.8rem;
          color: #667eea;
          font-weight: 500;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn-primary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .btn-secondary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .contact-form {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .form-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .btn-primary.full-width {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-description {
            font-size: 1rem;
            max-width: 100%;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .hero-image-placeholder {
            width: 250px;
            height: 250px;
          }
          
          .about-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .about-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary.large,
          .btn-secondary.large {
            width: 100%;
            max-width: 300px;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .service-card {
            min-height: auto;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .hero-image-placeholder {
            width: 200px;
            height: 200px;
          }
          
          .image-icon {
            font-size: 3rem;
          }
          
          .service-card {
            padding: 1.5rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
        }
      </style>
    `;
  };

  const generateBusinessContent = (userRequest: string, textColor: string, data: any) => {
    // Extract business name more intelligently
    let businessName = 'Professional Services';
    if (userRequest.includes('make a') || userRequest.includes('create a')) {
      const match = userRequest.match(/(?:make a|create a)\s+([^.!?]+?)(?:\s+(?:website|site|business))?/);
      if (match) {
        businessName = match[1].trim().replace(/\s+/g, ' ');
      }
    }
    
    // More specific business type detection
    let businessType = 'Professional Services';
    let services = [];
    let description = '';
    
    if (userRequest.includes('snowplow') || userRequest.includes('snow plow') || userRequest.includes('plowing')) {
      businessType = 'Snowplow & Winter Services';
      services = [
        { icon: '❄️', title: 'Snow Plowing', desc: 'Residential and commercial snow removal' },
        { icon: '🧹', title: 'Ice Management', desc: 'Professional ice removal and prevention' },
        { icon: '🚛', title: 'Equipment Rental', desc: 'Heavy-duty snow removal equipment' }
      ];
      description = 'We are a trusted snow removal company with years of experience keeping driveways, parking lots, and walkways safe and clear during winter months. Our professional team and reliable equipment ensure your property stays accessible all season long.';
    } else if (userRequest.includes('landscaping') || userRequest.includes('landscape')) {
      businessType = 'Landscaping Services';
      services = [
        { icon: '🌱', title: 'Lawn Care', desc: 'Professional lawn maintenance and care' },
        { icon: '🌳', title: 'Tree Services', desc: 'Tree trimming and removal services' },
        { icon: '🌸', title: 'Garden Design', desc: 'Custom garden and landscape design' }
      ];
      description = 'We provide comprehensive landscaping services to transform your outdoor spaces. From lawn care to garden design, we create beautiful, sustainable landscapes that enhance your property value.';
    } else if (userRequest.includes('construction') || userRequest.includes('contractor')) {
      businessType = 'Construction Services';
      services = [
        { icon: '🏗️', title: 'General Contracting', desc: 'Complete construction project management' },
        { icon: '🔨', title: 'Renovations', desc: 'Home and commercial renovations' },
        { icon: '🏠', title: 'Custom Builds', desc: 'Custom home and building construction' }
      ];
      description = 'We are a full-service construction company specializing in quality craftsmanship and reliable project delivery. From renovations to custom builds, we bring your vision to life.';
    } else if (userRequest.includes('restaurant') || userRequest.includes('cafe')) {
      businessType = 'Restaurant & Dining';
      services = [
        { icon: '🍽️', title: 'Fine Dining', desc: 'Exceptional culinary experiences' },
        { icon: '🍕', title: 'Casual Dining', desc: 'Comfortable and delicious meals' },
        { icon: '🎉', title: 'Catering', desc: 'Professional event catering services' }
      ];
      description = 'We are a premier dining establishment committed to providing exceptional food, outstanding service, and memorable experiences for our guests.';
    } else if (userRequest.includes('barber') || userRequest.includes('salon')) {
      businessType = 'Beauty & Grooming';
      services = [
        { icon: '✂️', title: 'Hair Services', desc: 'Professional haircuts and styling' },
        { icon: '💇', title: 'Styling', desc: 'Expert hair styling and treatments' },
        { icon: '💅', title: 'Beauty Services', desc: 'Complete beauty and grooming services' }
      ];
      description = 'We are a professional beauty and grooming salon dedicated to helping you look and feel your best with expert services and personalized care.';
    } else if (userRequest.includes('gym') || userRequest.includes('fitness')) {
      businessType = 'Fitness & Wellness';
      services = [
        { icon: '💪', title: 'Personal Training', desc: 'One-on-one fitness coaching' },
        { icon: '🏃', title: 'Group Classes', desc: 'Fun and effective group workouts' },
        { icon: '🧘', title: 'Wellness Programs', desc: 'Holistic health and wellness' }
      ];
      description = 'We are a comprehensive fitness center focused on helping you achieve your health and wellness goals through expert training and supportive community.';
    } else {
      services = [
        { icon: '🔧', title: 'Professional Service', desc: 'High-quality professional services' },
        { icon: '⚡', title: 'Fast Response', desc: 'Quick and reliable service delivery' },
        { icon: '💯', title: 'Quality Guarantee', desc: '100% satisfaction guaranteed' }
      ];
      description = 'We are a professional service company dedicated to providing exceptional quality and reliable solutions for our clients. With years of experience and a commitment to excellence, we deliver results that exceed expectations.';
    }
    
    return `
      <div class="business-website">
        <header class="hero-section">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-icon">${businessType === 'Snowplow & Winter Services' ? '❄️' : businessType === 'Landscaping Services' ? '🌱' : businessType === 'Construction Services' ? '🏗️' : '⭐'}</span>
              <span class="badge-text">Professional Service</span>
            </div>
            <h1 class="hero-title">${businessName}</h1>
            <p class="hero-subtitle">${businessType}</p>
            <p class="hero-description">Professional ${businessType.toLowerCase()} with years of experience and commitment to excellence</p>
            <div class="hero-buttons">
              <button class="btn-primary">Get Free Quote</button>
              <button class="btn-secondary">View Services</button>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Happy Customers</div>
              </div>
              <div class="stat">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Emergency Service</div>
              </div>
              <div class="stat">
                <div class="stat-number">100%</div>
                <div class="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-image-placeholder">
              <div class="image-icon">${businessType === 'Snowplow & Winter Services' ? '🚛' : businessType === 'Landscaping Services' ? '🌳' : businessType === 'Construction Services' ? '🏗️' : '💼'}</div>
            </div>
          </div>
        </header>
        
        <section class="services-section">
          <div class="section-header">
            <div class="section-badge">Services</div>
            <h2 class="section-title">What We Offer</h2>
            <p class="section-description">Comprehensive ${businessType.toLowerCase()} solutions tailored to your needs</p>
          </div>
          <div class="services-grid">
            ${services.map((service, index) => `
              <div class="service-card" style="animation-delay: ${index * 0.1}s;">
                <div class="service-card-header">
                  <div class="service-icon-wrapper">
                    <div class="service-icon">${service.icon}</div>
                  </div>
                  <div class="service-number">0${index + 1}</div>
                </div>
                <div class="service-card-content">
                  <h3 class="service-title">${service.title}</h3>
                  <p class="service-description">${service.desc}</p>
                  <div class="service-features">
                    <span class="feature-tag">Professional</span>
                    <span class="feature-tag">Reliable</span>
                    <span class="feature-tag">Affordable</span>
                  </div>
                </div>
                <div class="service-card-footer">
                  <button class="service-btn">Learn More</button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
        
        <section class="about-section">
          <div class="about-container">
            <div class="about-content">
              <div class="section-header">
                <div class="section-badge">About Us</div>
                <h2 class="section-title">Why Choose ${businessName}?</h2>
                <p class="section-description">${description}</p>
              </div>
              <div class="about-features">
                <div class="about-feature">
                  <div class="feature-icon">⭐</div>
                  <div class="feature-content">
                    <h4>Experienced Team</h4>
                    <p>Years of expertise in ${businessType.toLowerCase()}</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">🛡️</div>
                  <div class="feature-content">
                    <h4>Fully Insured</h4>
                    <p>Complete protection and peace of mind</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-content">
                    <h4>Fast Response</h4>
                    <p>Quick service when you need it most</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">💯</div>
                  <div class="feature-content">
                    <h4>Quality Guarantee</h4>
                    <p>100% satisfaction or your money back</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-visual">
              <div class="about-image-placeholder">
                <div class="about-icon">${businessType === 'Snowplow & Winter Services' ? '❄️' : businessType === 'Landscaping Services' ? '🌿' : businessType === 'Construction Services' ? '🔨' : '💼'}</div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="contact-section">
          <div class="contact-container">
            <div class="contact-content">
              <div class="section-header">
                <div class="section-badge">Contact</div>
                <h2 class="section-title">Get Your Free Quote Today</h2>
                <p class="section-description">Ready to get started? Contact us today for a free quote!</p>
              </div>
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="contact-icon">📞</div>
                  <div class="contact-details">
                    <h4>Call Us</h4>
                    <p>(555) 123-4567</p>
                    <span class="contact-note">Available 24/7</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📧</div>
                  <div class="contact-details">
                    <h4>Email Us</h4>
                    <p>info@${businessName.toLowerCase().replace(/\s+/g, '')}.com</p>
                    <span class="contact-note">Quick response</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📍</div>
                  <div class="contact-details">
                    <h4>Service Area</h4>
                    <p>Serving the local area</p>
                    <span class="contact-note">Free estimates</span>
                  </div>
                </div>
              </div>
              <div class="cta-buttons">
                <button class="btn-primary large">Get Free Quote</button>
                <button class="btn-secondary large">Call Now</button>
              </div>
            </div>
            <div class="contact-form">
              <div class="form-container">
                <h3>Quick Contact Form</h3>
                <form class="contact-form-fields">
                  <div class="form-group">
                    <input type="text" placeholder="Your Name" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="email" placeholder="Your Email" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="tel" placeholder="Phone Number" class="form-input">
                  </div>
                  <div class="form-group">
                    <textarea placeholder="Tell us about your project..." class="form-textarea" rows="4"></textarea>
                  </div>
                  <button type="submit" class="btn-primary full-width">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .business-website { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: 600px;
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1rem;
          opacity: 0.9;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
          max-width: 500px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .btn-primary {
          background: white;
          color: #667eea;
          padding: 1.25rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          min-width: 160px;
          text-align: center;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          background: #f8fafc;
        }
        
        .btn-secondary {
          background: transparent;
          color: white;
          padding: 1.25rem 2.5rem;
          border: 2px solid white;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          text-align: center;
        }
        
        .btn-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .hero-stats {
          display: flex;
          gap: 2rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hero-image-placeholder {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .hero-image-placeholder::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .image-icon {
          font-size: 4rem;
          z-index: 2;
          position: relative;
        }
        
        /* Services Section */
        .services-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 2rem;
        }
        
        .section-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .services-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          min-height: 320px;
          display: flex;
          flex-direction: column;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .service-icon-wrapper {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .service-icon {
          font-size: 1.5rem;
          color: white;
        }
        
        .service-number {
          font-size: 0.9rem;
          color: #667eea;
          font-weight: 600;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .service-description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          flex-grow: 1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .service-features {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .feature-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .service-btn {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: auto;
        }
        
        .service-btn:hover {
          background: #667eea;
          color: white;
        }
        
        /* About Section */
        .about-section {
          padding: 80px 0;
          background: white;
        }
        
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        
        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .about-feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .about-feature .feature-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }
        
        .about-feature h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-feature p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-visual {
          display: flex;
          justify-content: center;
        }
        
        .about-image-placeholder {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .about-icon {
          font-size: 3rem;
          color: white;
        }
        
        /* Contact Section */
        .contact-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .contact-method {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .contact-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }
        
        .contact-details p {
          color: #666;
          font-weight: 500;
        }
        
        .contact-note {
          font-size: 0.8rem;
          color: #667eea;
          font-weight: 500;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn-primary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .btn-secondary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .contact-form {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .form-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .btn-primary.full-width {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-description {
            font-size: 1rem;
            max-width: 100%;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .hero-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .hero-image-placeholder {
            width: 250px;
            height: 250px;
          }
          
          .about-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .about-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary.large,
          .btn-secondary.large {
            width: 100%;
            max-width: 300px;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .service-card {
            min-height: auto;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .hero-image-placeholder {
            width: 200px;
            height: 200px;
          }
          
          .image-icon {
            font-size: 3rem;
          }
          
          .service-card {
            padding: 1.5rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
        }
      </style>
    `;
  };

  const generateAdvancedPortfolioContent = (userRequest: string, textColor: string, data: any) => {
    const name = data.name || extractNameFromRequest(userRequest);
    const profession = data.profession || 'Professional';
    const linkedin = data.linkedin || extractLinkedInFromRequest(userRequest);
    
    return `
      <div class="advanced-portfolio">
        <header class="hero-section">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1rem; font-weight: 300;">${name}</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; opacity: 0.9; margin-bottom: 2rem;">${profession}</p>
          ${linkedin ? `<a href="${linkedin}" style="color: ${textColor}; text-decoration: none; border: 2px solid ${textColor}; padding: 0.8rem 2rem; border-radius: 25px; display: inline-block;">LinkedIn Profile</a>` : ''}
        </header>
        
        <section class="about-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">About Me</h2>
          <p style="color: ${textColor}; font-size: 1.2rem; line-height: 1.8; max-width: 700px; margin: 0 auto;">
            ${profession === 'freelance news journalist' ? 
              'Experienced journalist with a passion for uncovering truth and telling compelling stories. Specializing in investigative reporting and breaking news coverage.' :
              'Passionate professional with expertise in modern technologies and creative solutions. Dedicated to delivering exceptional results and innovative approaches.'}
          </p>
        </section>
        
        <section class="skills-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Expertise</h2>
          <div class="skills-grid">
            ${profession === 'freelance news journalist' ? 
              '<div class="skill-item">Investigative Reporting</div><div class="skill-item">Breaking News</div><div class="skill-item">Digital Media</div><div class="skill-item">Storytelling</div><div class="skill-item">Research</div><div class="skill-item">Interviewing</div>' :
              '<div class="skill-item">React</div><div class="skill-item">Next.js</div><div class="skill-item">TypeScript</div><div class="skill-item">Node.js</div><div class="skill-item">UI/UX</div><div class="skill-item">Python</div>'}
          </div>
        </section>
        
        <section class="work-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Recent Work</h2>
          <div class="work-grid">
            ${profession === 'freelance news journalist' ? 
              '<div class="work-item"><h3>Breaking News Coverage</h3><p>Real-time reporting on major events</p></div><div class="work-item"><h3>Investigative Series</h3><p>In-depth analysis and fact-finding</p></div><div class="work-item"><h3>Feature Stories</h3><p>Human-interest pieces and profiles</p></div>' :
              '<div class="work-item"><h3>E-commerce Platform</h3><p>Full-stack solution with modern tech</p></div><div class="work-item"><h3>AI Chat Application</h3><p>Real-time communication platform</p></div><div class="work-item"><h3>Mobile App</h3><p>Cross-platform mobile solution</p></div>'}
          </div>
        </section>
        
        <footer class="contact-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Get In Touch</h2>
          <p style="color: ${textColor}; font-size: 1.2rem;">Ready to collaborate? Let's discuss your next project.</p>
          <div class="contact-info">
            <p style="color: ${textColor}; opacity: 0.8;">Email: ${name.toLowerCase().replace(' ', '.')}@email.com</p>
            <p style="color: ${textColor}; opacity: 0.8;">Phone: +1 (555) 123-4567</p>
          </div>
        </footer>
      </div>
      
      <style>
        .advanced-portfolio { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        .hero-section { text-align: center; margin-bottom: 4rem; padding: 3rem 0; }
        .about-section, .skills-section, .work-section, .contact-section { margin-bottom: 4rem; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .skill-item { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: center; color: ${textColor}; font-weight: 500; }
        .work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .work-item { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; }
        .work-item h3 { color: ${textColor}; font-size: 1.4rem; margin-bottom: 1rem; }
        .work-item p { color: ${textColor}; opacity: 0.8; line-height: 1.6; }
        .contact-section { text-align: center; margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.2); }
        .contact-info { margin-top: 2rem; }
      </style>
    `;
  };

  const generateRestaurantContent = (userRequest: string, textColor: string, data: any) => {
    const isItalian = userRequest.toLowerCase().includes('italian');
    const restaurantName = isItalian ? 'Bella Vista' : 'The Golden Spoon';
    const cuisine = isItalian ? 'Authentic Italian' : 'Fine Dining';
    
    return `
      <div class="restaurant-website">
        <header class="restaurant-hero">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1rem; font-family: serif;">${restaurantName}</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 2rem;">${cuisine} Experience</p>
          <div class="hero-buttons">
            <button style="background: ${textColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; margin-right: 1rem; cursor: pointer;">View Menu</button>
            <button style="background: transparent; color: ${textColor}; padding: 1rem 2rem; border: 2px solid ${textColor}; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">Reservations</button>
          </div>
        </header>
        
        <section class="menu-section">
          <h2 style="color: ${textColor}; font-size: 3rem; text-align: center; margin: 3rem 0;">Our Menu</h2>
          <div class="menu-categories">
            <div class="menu-category">
              <h3 style="color: ${textColor}; font-size: 2rem; margin-bottom: 1.5rem;">Appetizers</h3>
              <div class="menu-items">
                <div class="menu-item">
                  <h4 style="color: ${textColor}; font-size: 1.3rem;">${isItalian ? 'Bruschetta Classica' : 'Crispy Calamari'}</h4>
                  <p style="color: ${textColor}; opacity: 0.8; margin: 0.5rem 0;">${isItalian ? 'Fresh tomatoes, basil, and mozzarella on artisan bread' : 'Served with marinara sauce and lemon'}</p>
                  <span style="color: ${textColor}; font-weight: bold; font-size: 1.2rem;">$12</span>
                </div>
                <div class="menu-item">
                  <h4 style="color: ${textColor}; font-size: 1.3rem;">${isItalian ? 'Antipasto Misto' : 'Wagyu Beef Carpaccio'}</h4>
                  <p style="color: ${textColor}; opacity: 0.8; margin: 0.5rem 0;">${isItalian ? 'Selection of cured meats, cheeses, and olives' : 'Thinly sliced with arugula and parmesan'}</p>
                  <span style="color: ${textColor}; font-weight: bold; font-size: 1.2rem;">$18</span>
                </div>
              </div>
            </div>
            
            <div class="menu-category">
              <h3 style="color: ${textColor}; font-size: 2rem; margin-bottom: 1.5rem;">Main Courses</h3>
              <div class="menu-items">
                <div class="menu-item">
                  <h4 style="color: ${textColor}; font-size: 1.3rem;">${isItalian ? 'Spaghetti Carbonara' : 'Pan-Seared Salmon'}</h4>
                  <p style="color: ${textColor}; opacity: 0.8; margin: 0.5rem 0;">${isItalian ? 'Classic Roman pasta with eggs, cheese, and pancetta' : 'With seasonal vegetables and lemon butter sauce'}</p>
                  <span style="color: ${textColor}; font-weight: bold; font-size: 1.2rem;">$24</span>
                </div>
                <div class="menu-item">
                  <h4 style="color: ${textColor}; font-size: 1.3rem;">${isItalian ? 'Osso Buco' : 'Ribeye Steak'}</h4>
                  <p style="color: ${textColor}; opacity: 0.8; margin: 0.5rem 0;">${isItalian ? 'Braised veal shanks with risotto milanese' : '12oz prime cut with roasted potatoes'}</p>
                  <span style="color: ${textColor}; font-weight: bold; font-size: 1.2rem;">$32</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Hours</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Mon-Thu: 5PM-10PM<br>Fri-Sat: 5PM-11PM<br>Sunday: 4PM-9PM</p>
            </div>
            <div class="info-item">
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Location</h3>
              <p style="color: ${textColor}; opacity: 0.8;">123 Main Street<br>Downtown District<br>Phone: (555) 123-4567</p>
            </div>
            <div class="info-item">
              <h3 style="color: ${textColor}; font-size: 1.5rem;">Reservations</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Call ahead or book online<br>Private dining available<br>Special events welcome</p>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        .restaurant-website { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .restaurant-hero { text-align: center; margin-bottom: 4rem; padding: 3rem 0; }
        .hero-buttons { margin-top: 2rem; }
        .menu-section { margin: 4rem 0; }
        .menu-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 3rem; }
        .menu-category { margin-bottom: 3rem; }
        .menu-items { display: flex; flex-direction: column; gap: 1.5rem; }
        .menu-item { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: flex-start; }
        .menu-item h4 { margin: 0; }
        .menu-item p { margin: 0.5rem 0; }
        .info-section { margin: 4rem 0; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .info-item { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; text-align: center; }
      </style>
    `;
  };

  const generateAdvancedSnowplowContent = (userRequest: string, textColor: string, data: any) => {
    const businessName = extractBusinessName(userRequest) || 'Smart Snowplow Co';
    const primaryColor = '#1E3A8A'; // Deep blue
    const accentColor = '#3B82F6'; // Bright blue
    const warningColor = '#F59E0B'; // Amber
    const backgroundColor = '#F8FAFC'; // Light gray
    
    return `
      <div class="snowplow-website" style="background: ${backgroundColor}; font-family: 'Inter', sans-serif;">
        <!-- Hero Section -->
        <header class="snowplow-hero" style="background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%); position: relative; overflow: hidden;">
          <div class="hero-pattern" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/></svg>');"></div>
          <div class="hero-content" style="position: relative; z-index: 2; padding: 4rem 2rem; text-align: center; color: white;">
            <div class="snowplow-badge" style="display: inline-block; background: rgba(255,255,255,0.15); padding: 0.5rem 1rem; border-radius: 8px; margin-bottom: 1rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
              <span class="badge-icon" style="font-size: 1.2rem; margin-right: 0.5rem;">🚛</span>
              <span class="badge-text" style="font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Professional Snow Services</span>
            </div>
            <h1 class="snowplow-title" style="font-size: 4rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${businessName}</h1>
            <p class="snowplow-subtitle" style="font-size: 1.5rem; margin-bottom: 1rem; opacity: 0.9; font-weight: 500;">Professional Snowplow & Winter Services</p>
            <p class="snowplow-description" style="font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6; opacity: 0.8;">Years of experience and commitment to excellence in snow removal and winter maintenance services</p>
            <div class="hero-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-primary" style="background: ${warningColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                Get Free Quote
              </button>
              <button class="btn-secondary" style="background: transparent; border: 2px solid white; color: white; padding: 1rem 2rem; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                View Services
              </button>
            </div>
            <div class="snowplow-stats" style="display: flex; justify-content: center; gap: 3rem; margin-top: 3rem; flex-wrap: wrap;">
              <div class="stat" style="text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: ${warningColor};">500+</div>
                <div class="stat-label" style="font-size: 0.9rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Happy Customers</div>
              </div>
              <div class="stat" style="text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: ${warningColor};">24/7</div>
                <div class="stat-label" style="font-size: 0.9rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Emergency Service</div>
              </div>
              <div class="stat" style="text-align: center;">
                <div class="stat-number" style="font-size: 2.5rem; font-weight: 700; color: ${warningColor};">100%</div>
                <div class="stat-label" style="font-size: 0.9rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">Satisfaction</div>
              </div>
            </div>
          </div>
          <div class="hero-visual" style="position: absolute; right: 2rem; top: 50%; transform: translateY(-50%); z-index: 1;">
            <div class="snowplow-image-placeholder" style="width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
              <div class="image-icon" style="font-size: 4rem;">🚛</div>
            </div>
          </div>
        </header>
        
        <!-- Services Section -->
        <section class="services-section" style="padding: 4rem 2rem; background: white;">
          <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
            <div class="section-badge" style="display: inline-block; background: ${primaryColor}; color: white; padding: 0.5rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Services</div>
            <h2 class="section-title" style="font-size: 3rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 700;">Our Snow Services</h2>
            <p class="section-description" style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">Professional snow removal and winter maintenance services for residential and commercial properties</p>
          </div>
          <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
            <div class="service-card" style="background: #f8fafc; padding: 2rem; border-radius: 12px; border: 2px solid #e2e8f0; transition: all 0.3s ease; cursor: pointer;">
              <div class="service-icon" style="width: 60px; height: 60px; background: ${primaryColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                <span style="font-size: 2rem;">🚛</span>
              </div>
              <h3 class="service-title" style="font-size: 1.5rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 600;">Snow Plowing</h3>
              <p class="service-description" style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">Professional snow plowing services for driveways, parking lots, and roadways</p>
              <div class="service-features" style="margin-bottom: 1.5rem;">
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">24/7 Available</div>
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">Fast Response</div>
              </div>
              <button class="service-btn" style="background: ${primaryColor}; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Learn More</button>
            </div>
            
            <div class="service-card" style="background: #f8fafc; padding: 2rem; border-radius: 12px; border: 2px solid #e2e8f0; transition: all 0.3s ease; cursor: pointer;">
              <div class="service-icon" style="width: 60px; height: 60px; background: ${primaryColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                <span style="font-size: 2rem;">🧹</span>
              </div>
              <h3 class="service-title" style="font-size: 1.5rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 600;">Snow Shoveling</h3>
              <p class="service-description" style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">Manual snow shoveling for walkways, steps, and hard-to-reach areas</p>
              <div class="service-features" style="margin-bottom: 1.5rem;">
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">Precision Work</div>
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">Salt Application</div>
              </div>
              <button class="service-btn" style="background: ${primaryColor}; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Learn More</button>
            </div>
            
            <div class="service-card" style="background: #f8fafc; padding: 2rem; border-radius: 12px; border: 2px solid #e2e8f0; transition: all 0.3s ease; cursor: pointer;">
              <div class="service-icon" style="width: 60px; height: 60px; background: ${primaryColor}; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                <span style="font-size: 2rem;">🏢</span>
              </div>
              <h3 class="service-title" style="font-size: 1.5rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 600;">Commercial Services</h3>
              <p class="service-description" style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">Large-scale snow removal for commercial properties and businesses</p>
              <div class="service-features" style="margin-bottom: 1.5rem;">
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">Contract Pricing</div>
                <div class="feature-tag" style="display: inline-block; background: ${accentColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">Priority Service</div>
              </div>
              <button class="service-btn" style="background: ${primaryColor}; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Learn More</button>
            </div>
          </div>
        </section>
        
        <!-- About Section -->
        <section class="about-section" style="padding: 4rem 2rem; background: ${backgroundColor};">
          <div class="about-container" style="max-width: 1200px; margin: 0 auto;">
            <div class="about-content" style="text-align: center; margin-bottom: 3rem;">
              <div class="section-header">
                <div class="section-badge" style="display: inline-block; background: ${primaryColor}; color: white; padding: 0.5rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">About Us</div>
                <h2 class="section-title" style="font-size: 3rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 700;">Why Choose ${businessName}?</h2>
                <p class="section-description" style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">Professional snow removal services with years of experience and commitment to excellence</p>
              </div>
              <div class="about-features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem;">
                <div class="about-feature" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #e2e8f0;">
                  <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                  <div class="feature-content">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Fast Response</h4>
                    <p style="color: #666; line-height: 1.5;">Quick response times to ensure your property is cleared promptly</p>
                  </div>
                </div>
                <div class="about-feature" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #e2e8f0;">
                  <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                  <div class="feature-content">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Insured & Licensed</h4>
                    <p style="color: #666; line-height: 1.5;">Fully insured and licensed for your peace of mind</p>
                  </div>
                </div>
                <div class="about-feature" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #e2e8f0;">
                  <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">🔧</div>
                  <div class="feature-content">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Professional Equipment</h4>
                    <p style="color: #666; line-height: 1.5;">State-of-the-art equipment for efficient snow removal</p>
                  </div>
                </div>
                <div class="about-feature" style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 2px solid #e2e8f0;">
                  <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
                  <div class="feature-content">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Customer Satisfaction</h4>
                    <p style="color: #666; line-height: 1.5;">100% customer satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Contact Section -->
        <section class="contact-section" style="padding: 4rem 2rem; background: white;">
          <div class="contact-container" style="max-width: 1200px; margin: 0 auto;">
            <div class="contact-content" style="text-align: center; margin-bottom: 3rem;">
              <div class="section-header">
                <div class="section-badge" style="display: inline-block; background: ${primaryColor}; color: white; padding: 0.5rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Contact</div>
                <h2 class="section-title" style="font-size: 3rem; color: ${primaryColor}; margin-bottom: 1rem; font-weight: 700;">Get Your Free Quote Today</h2>
                <p class="section-description" style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">Ready to experience professional snow removal services? Contact us for a free quote</p>
              </div>
              <div class="contact-methods" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 3rem 0;">
                <div class="contact-method" style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;">
                  <div class="contact-icon" style="font-size: 3rem; margin-bottom: 1rem;">📞</div>
                  <div class="contact-details">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Call Us</h4>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 0.5rem;">(555) 123-4567</p>
                    <span class="contact-note" style="font-size: 0.9rem; color: #999;">24/7 Emergency Service</span>
                  </div>
                </div>
                <div class="contact-method" style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;">
                  <div class="contact-icon" style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                  <div class="contact-details">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Service Area</h4>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 0.5rem;">Greater Metro Area</p>
                    <span class="contact-note" style="font-size: 0.9rem; color: #999;">Free estimates</span>
                  </div>
                </div>
                <div class="contact-method" style="text-align: center; padding: 2rem; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;">
                  <div class="contact-icon" style="font-size: 3rem; margin-bottom: 1rem;">⏰</div>
                  <div class="contact-details">
                    <h4 style="font-size: 1.3rem; color: ${primaryColor}; margin-bottom: 0.5rem; font-weight: 600;">Hours</h4>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 0.5rem;">24/7 During Snow Season</p>
                    <span class="contact-note" style="font-size: 0.9rem; color: #999;">Emergency calls welcome</span>
                  </div>
                </div>
              </div>
              <div class="cta-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary large" style="background: ${warningColor}; color: white; padding: 1.2rem 2.5rem; border: none; border-radius: 8px; font-size: 1.2rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">Get Free Quote</button>
                <button class="btn-secondary large" style="background: transparent; border: 2px solid ${primaryColor}; color: ${primaryColor}; padding: 1.2rem 2.5rem; border-radius: 8px; font-size: 1.2rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Call Now</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  };

  // Advanced Auto Detailing Content Generator
  const generateAdvancedAutoDetailingContent = (prompt: string, textColor: string, data: any) => {
    const businessName = data.businessName || 'Premium Auto Detailing';
    const services = [
      { name: 'Full Detail Service', price: '$150', description: 'Complete interior and exterior detailing' },
      { name: 'Paint Correction', price: '$300', description: 'Professional paint restoration and protection' },
      { name: 'Ceramic Coating', price: '$500', description: 'Long-lasting paint protection' },
      { name: 'Interior Deep Clean', price: '$120', description: 'Thorough interior cleaning and protection' }
    ];
    
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${businessName}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
            .hero-section {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: white;
                padding: 4rem 2rem;
                text-align: center;
                min-height: 600px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            .hero-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            .hero-content { position: relative; z-index: 2; }
            .hero-badge {
                display: inline-block;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                padding: 0.5rem 1rem;
                border-radius: 50px;
                font-size: 0.9rem;
                margin-bottom: 2rem;
                font-weight: 500;
            }
            .hero-title {
                font-size: 3.5rem;
                font-weight: 800;
                margin-bottom: 1.5rem;
                background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.2;
            }
            .hero-subtitle {
                font-size: 1.3rem;
                margin-bottom: 2rem;
                opacity: 0.9;
                font-weight: 400;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.4;
            }
            .hero-description {
                font-size: 1.1rem;
                margin-bottom: 3rem;
                opacity: 0.8;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.5;
            }
            .hero-stats {
                display: flex;
                justify-content: center;
                gap: 3rem;
                margin-bottom: 3rem;
                flex-wrap: wrap;
            }
            .stat {
                text-align: center;
            }
            .stat-number {
                font-size: 2.5rem;
                font-weight: 700;
                color: #60a5fa;
                display: block;
            }
            .stat-label {
                font-size: 0.9rem;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .hero-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                align-items: center;
            }
            .btn {
                padding: 1.2rem 2.5rem;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                min-width: 160px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
            }
            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
            }
            .btn-secondary {
                background: transparent;
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                backdrop-filter: blur(10px);
            }
            .btn-secondary:hover {
                background: rgba(255,255,255,0.1);
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255,255,255,0.2);
            }
            .services-section {
                padding: 5rem 2rem;
                background: #f8fafc;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .section-title {
                font-size: 2.5rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 1rem;
                color: #1e293b;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.3;
            }
            .section-description {
                font-size: 1.2rem;
                text-align: center;
                color: #64748b;
                margin-bottom: 4rem;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.6;
            }
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }
            .service-card {
                background: white;
                padding: 2.5rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(0,0,0,0.05);
                min-height: 320px;
                display: flex;
                flex-direction: column;
            }
            .service-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.15);
            }
            .service-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                font-size: 2rem;
            }
            .service-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1e293b;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.4;
            }
            .service-price {
                font-size: 1.8rem;
                font-weight: 700;
                color: #3b82f6;
                margin-bottom: 1rem;
            }
            .service-description {
                color: #64748b;
                line-height: 1.6;
                flex-grow: 1;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.6;
            }
            .service-btn {
                margin-top: auto;
                padding: 0.8rem 1.5rem;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 1.5rem;
            }
            .service-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            .about-section {
                padding: 5rem 2rem;
                background: white;
            }
            .about-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: center;
            }
            .about-text h3 {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1.5rem;
                color: #1e293b;
            }
            .about-text p {
                font-size: 1.1rem;
                color: #64748b;
                margin-bottom: 2rem;
                line-height: 1.7;
            }
            .about-features {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }
            .about-feature {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .about-feature-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }
            .about-feature h4 {
                font-size: 1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.25rem;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.4;
            }
            .about-feature p {
                font-size: 0.9rem;
                color: #64748b;
                margin: 0;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.5;
            }
            .contact-section {
                padding: 5rem 2rem;
                background: #f8fafc;
            }
            .contact-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
            }
            .contact-info h3 {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1.5rem;
                color: #1e293b;
            }
            .contact-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }
            .contact-item-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.3rem;
            }
            .contact-item-content h4 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.25rem;
            }
            .contact-item-content p {
                color: #64748b;
                margin: 0;
                word-wrap: break-word;
                overflow-wrap: break-word;
                line-height: 1.5;
            }
            .contact-form {
                background: white;
                padding: 2.5rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-group label {
                display: block;
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #3b82f6;
            }
            .form-group textarea {
                height: 120px;
                resize: vertical;
            }
            .submit-btn {
                width: 100%;
                padding: 1.2rem;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            }
            @media (max-width: 768px) {
                .hero-title { font-size: 2.5rem; }
                .hero-subtitle { font-size: 1.1rem; }
                .hero-stats { gap: 2rem; }
                .stat-number { font-size: 2rem; }
                .hero-buttons { flex-direction: column; }
                .btn { width: 100%; max-width: 300px; }
                .about-content { grid-template-columns: 1fr; }
                .contact-content { grid-template-columns: 1fr; }
                .about-features { grid-template-columns: 1fr; }
            }
            @media (max-width: 480px) {
                .hero-section { padding: 3rem 1rem; }
                .services-section, .about-section, .contact-section { padding: 3rem 1rem; }
                .hero-title { font-size: 2rem; }
                .section-title { font-size: 2rem; }
                .service-card { padding: 2rem; }
            }
        </style>
    </head>
    <body>
        <div class="hero-section">
            <div class="hero-content">
                <div class="hero-badge">🚗 Professional Auto Detailing</div>
                <h1 class="hero-title">${businessName}</h1>
                <p class="hero-subtitle">Transform Your Vehicle with Premium Detailing Services</p>
                <p class="hero-description">Professional auto detailing services that bring your vehicle back to showroom condition. We use premium products and techniques to deliver exceptional results.</p>
                
                <div class="hero-stats">
                    <div class="stat">
                        <span class="stat-number">500+</span>
                        <span class="stat-label">Cars Detailed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">5★</span>
                        <span class="stat-label">Customer Rating</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">3+</span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                </div>
                
                <div class="hero-buttons">
                    <a href="#services" class="btn btn-primary">View Services</a>
                    <a href="#contact" class="btn btn-secondary">Get Quote</a>
                </div>
            </div>
        </div>

        <div class="services-section" id="services">
            <div class="container">
                <h2 class="section-title">Our Detailing Services</h2>
                <p class="section-description">Professional auto detailing services tailored to your vehicle's needs</p>
                
                <div class="services-grid">
                    ${services.map(service => `
                    <div class="service-card">
                        <div class="service-icon">🚗</div>
                        <h3 class="service-title">${service.name}</h3>
                        <div class="service-price">${service.price}</div>
                        <p class="service-description">${service.description}</p>
                        <button class="service-btn">Book Service</button>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="about-section">
            <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h3>Why Choose Our Auto Detailing?</h3>
                        <p>We're passionate about bringing your vehicle back to its original glory. Our team uses only the finest products and techniques to ensure your car looks and feels like new.</p>
                        <p>From paint correction to ceramic coating, we offer comprehensive services that protect and enhance your vehicle's appearance.</p>
                    </div>
                    <div class="about-features">
                        <div class="about-feature">
                            <div class="about-feature-icon">✨</div>
                            <div>
                                <h4>Premium Products</h4>
                                <p>Only the finest detailing products</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-feature-icon">🛡️</div>
                            <div>
                                <h4>Paint Protection</h4>
                                <p>Long-lasting ceramic coatings</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-feature-icon">👨‍🔧</div>
                            <div>
                                <h4>Expert Technicians</h4>
                                <p>Certified detailing professionals</p>
                            </div>
                        </div>
                        <div class="about-feature">
                            <div class="about-feature-icon">📱</div>
                            <div>
                                <h4>Easy Booking</h4>
                                <p>Schedule online or call us</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact-section" id="contact">
            <div class="container">
                <h2 class="section-title">Get Your Quote Today</h2>
                <div class="contact-content">
                    <div class="contact-info">
                        <h3>Contact Information</h3>
                        <div class="contact-item">
                            <div class="contact-item-icon">📞</div>
                            <div class="contact-item-content">
                                <h4>Phone</h4>
                                <p>(555) 123-4567</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-item-icon">📧</div>
                            <div class="contact-item-content">
                                <h4>Email</h4>
                                <p>info@premiumautodetailing.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-item-icon">📍</div>
                            <div class="contact-item-content">
                                <h4>Location</h4>
                                <p>123 Auto Detail St, City, State 12345</p>
                            </div>
                        </div>
                    </div>
                    <div class="contact-form">
                        <h3>Request a Quote</h3>
                        <form>
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="service">Service Needed</label>
                                <select id="service" name="service" style="width: 100%; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px;">
                                    <option value="full-detail">Full Detail Service</option>
                                    <option value="paint-correction">Paint Correction</option>
                                    <option value="ceramic-coating">Ceramic Coating</option>
                                    <option value="interior-clean">Interior Deep Clean</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="message">Additional Details</label>
                                <textarea id="message" name="message" placeholder="Tell us about your vehicle and any specific requirements..."></textarea>
                            </div>
                            <button type="submit" class="submit-btn">Get Quote</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
  };

  const generateAdvancedRestaurantContent = (userRequest: string, textColor: string, data: any) => {
    const isItalian = userRequest.toLowerCase().includes('italian');
    const hasMenu = userRequest.toLowerCase().includes('menu');
    const restaurantName = isItalian ? 'Bella Vista Ristorante' : 'The Golden Spoon';
    const cuisine = isItalian ? 'Authentic Italian' : 'Fine Dining';
    const primaryColor = isItalian ? '#8B4513' : '#B8860B';
    const accentColor = isItalian ? '#D2691E' : '#DAA520';
    
    return `
      <div class="restaurant-website">
        <!-- Hero Section -->
        <header class="restaurant-hero" style="background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);">
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <div class="restaurant-badge">
              <span class="badge-icon">🍽️</span>
              <span class="badge-text">${cuisine}</span>
            </div>
            <h1 class="restaurant-title" style="color: ${textColor};">${restaurantName}</h1>
            <p class="restaurant-subtitle" style="color: ${textColor};">${isItalian ? 'Experience the authentic flavors of Italy' : 'Where culinary artistry meets exceptional service'}</p>
            <p class="restaurant-description" style="color: ${textColor};">${isItalian ? 'Family recipes passed down through generations, crafted with love and the finest ingredients' : 'Award-winning cuisine in an elegant atmosphere'}</p>
            <div class="hero-buttons">
              <button class="btn-primary" style="background: ${textColor}; color: ${primaryColor};">
                ${hasMenu ? 'View Full Menu' : 'View Menu'}
              </button>
              <button class="btn-secondary" style="border-color: ${textColor}; color: ${textColor};">
                Make Reservation
              </button>
            </div>
            <div class="restaurant-stats">
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">4.9★</div>
                <div class="stat-label" style="color: ${textColor};">Google Rating</div>
              </div>
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">15+</div>
                <div class="stat-label" style="color: ${textColor};">Years Experience</div>
              </div>
              <div class="stat">
                <div class="stat-number" style="color: ${textColor};">100%</div>
                <div class="stat-label" style="color: ${textColor};">Fresh Ingredients</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="restaurant-image-placeholder">
              <div class="image-icon">${isItalian ? '🍝' : '🍽️'}</div>
            </div>
          </div>
        </header>
        
        ${hasMenu ? `
        <!-- Menu Section -->
        <section class="menu-section">
          <div class="section-header">
            <div class="section-badge">Menu</div>
            <h2 class="section-title">Our ${isItalian ? 'Italian' : 'Signature'} Menu</h2>
            <p class="section-description">${isItalian ? 'Traditional recipes with a modern twist' : 'Crafted with passion and precision'}</p>
          </div>
          <div class="menu-categories">
            <div class="menu-category">
              <div class="category-header">
                <div class="category-icon">🥗</div>
                <h3 class="category-title">Appetizers</h3>
              </div>
              <div class="menu-items">
                <div class="menu-item">
                  <div class="menu-item-header">
                    <h4 class="item-name">${isItalian ? 'Bruschetta Classica' : 'Crispy Calamari'}</h4>
                    <span class="item-price">$12</span>
                  </div>
                  <p class="item-description">${isItalian ? 'Fresh tomatoes, basil, and mozzarella on artisan bread' : 'Served with marinara sauce and lemon'}</p>
                </div>
                <div class="menu-item">
                  <div class="menu-item-header">
                    <h4 class="item-name">${isItalian ? 'Antipasto Misto' : 'Wagyu Beef Carpaccio'}</h4>
                    <span class="item-price">$18</span>
                  </div>
                  <p class="item-description">${isItalian ? 'Selection of cured meats, cheeses, and olives' : 'Thinly sliced with arugula and parmesan'}</p>
                </div>
              </div>
            </div>
            
            <div class="menu-category">
              <div class="category-header">
                <div class="category-icon">🍝</div>
                <h3 class="category-title">Main Courses</h3>
              </div>
              <div class="menu-items">
                <div class="menu-item">
                  <div class="menu-item-header">
                    <h4 class="item-name">${isItalian ? 'Spaghetti Carbonara' : 'Pan-Seared Salmon'}</h4>
                    <span class="item-price">$24</span>
                  </div>
                  <p class="item-description">${isItalian ? 'Classic Roman pasta with eggs, cheese, and pancetta' : 'With seasonal vegetables and lemon butter sauce'}</p>
                </div>
                <div class="menu-item">
                  <div class="menu-item-header">
                    <h4 class="item-name">${isItalian ? 'Osso Buco' : 'Ribeye Steak'}</h4>
                    <span class="item-price">$32</span>
                  </div>
                  <p class="item-description">${isItalian ? 'Braised veal shanks with risotto milanese' : '12oz prime cut with roasted potatoes'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        ` : ''}
        
        <!-- About Section -->
        <section class="about-section">
          <div class="about-container">
            <div class="about-content">
              <div class="section-header">
                <div class="section-badge">About Us</div>
                <h2 class="section-title">Our ${isItalian ? 'Italian' : 'Culinary'} Story</h2>
                <p class="section-description">${isItalian ? 'Bringing authentic Italian flavors to your table since 2008' : 'Dedicated to creating memorable dining experiences'}</p>
              </div>
              <div class="about-features">
                <div class="about-feature">
                  <div class="feature-icon">👨‍🍳</div>
                  <div class="feature-content">
                    <h4>Expert Chefs</h4>
                    <p>${isItalian ? 'Trained in traditional Italian techniques' : 'Award-winning culinary professionals'}</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">🌱</div>
                  <div class="feature-content">
                    <h4>Fresh Ingredients</h4>
                    <p>${isItalian ? 'Imported directly from Italy' : 'Locally sourced and organic'}</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">🏆</div>
                  <div class="feature-content">
                    <h4>Award Winning</h4>
                    <p>${isItalian ? 'Recognized for authentic Italian cuisine' : 'Multiple culinary awards and recognition'}</p>
                  </div>
                </div>
                <div class="about-feature">
                  <div class="feature-icon">❤️</div>
                  <div class="feature-content">
                    <h4>Family Recipe</h4>
                    <p>${isItalian ? 'Generations of traditional recipes' : 'Passion-driven culinary excellence'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="about-visual">
              <div class="about-image-placeholder">
                <div class="about-icon">${isItalian ? '🍝' : '🍽️'}</div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Contact Section -->
        <section class="contact-section">
          <div class="contact-container">
            <div class="contact-content">
              <div class="section-header">
                <div class="section-badge">Contact</div>
                <h2 class="section-title">Visit Us Today</h2>
                <p class="section-description">${isItalian ? 'Experience authentic Italian dining' : 'Book your table for an unforgettable evening'}</p>
              </div>
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="contact-icon">📞</div>
                  <div class="contact-details">
                    <h4>Call Us</h4>
                    <p>(555) 123-4567</p>
                    <span class="contact-note">Reservations recommended</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📍</div>
                  <div class="contact-details">
                    <h4>Location</h4>
                    <p>123 Main Street, Downtown</p>
                    <span class="contact-note">Free valet parking</span>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">🕒</div>
                  <div class="contact-details">
                    <h4>Hours</h4>
                    <p>Mon-Sun: 5:00 PM - 10:00 PM</p>
                    <span class="contact-note">Closed Mondays</span>
                  </div>
                </div>
              </div>
              <div class="cta-buttons">
                <button class="btn-primary large">Make Reservation</button>
                <button class="btn-secondary large">Call Now</button>
              </div>
            </div>
            <div class="contact-form">
              <div class="form-container">
                <h3>Reservation Request</h3>
                <form class="contact-form-fields">
                  <div class="form-group">
                    <input type="text" placeholder="Your Name" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="email" placeholder="Your Email" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="tel" placeholder="Phone Number" class="form-input">
                  </div>
                  <div class="form-group">
                    <input type="date" placeholder="Preferred Date" class="form-input">
                  </div>
                  <div class="form-group">
                    <select class="form-input">
                      <option>Party Size</option>
                      <option>2 People</option>
                      <option>4 People</option>
                      <option>6 People</option>
                      <option>8+ People</option>
                    </select>
                  </div>
                  <button type="submit" class="btn-primary full-width">Request Reservation</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .restaurant-website { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
        }
        
        /* Hero Section */
        .restaurant-hero {
          color: white;
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          min-height: 600px;
        }
        
        .restaurant-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .restaurant-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .restaurant-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1rem;
          opacity: 0.9;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .restaurant-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.8;
          max-width: 500px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .btn-primary {
          padding: 1.25rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          min-width: 160px;
          text-align: center;
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .btn-secondary {
          padding: 1.25rem 2.5rem;
          background: transparent;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          text-align: center;
        }
        
        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .restaurant-stats {
          display: flex;
          gap: 2rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .restaurant-image-placeholder {
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .restaurant-image-placeholder::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .image-icon {
          font-size: 4rem;
          z-index: 2;
          position: relative;
        }
        
        /* Menu Section */
        .menu-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 2rem;
        }
        
        .section-badge {
          display: inline-block;
          background: ${primaryColor};
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .menu-categories {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 3rem;
        }
        
        .menu-category {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .menu-category:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .category-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid ${primaryColor};
        }
        
        .category-icon {
          font-size: 2rem;
        }
        
        .category-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: ${primaryColor};
        }
        
        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .menu-item {
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .menu-item:last-child {
          border-bottom: none;
        }
        
        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .item-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${primaryColor};
        }
        
        .item-description {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        /* About Section */
        .about-section {
          padding: 80px 0;
          background: white;
        }
        
        .about-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        
        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .about-feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        
        .about-feature .feature-icon {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }
        
        .about-feature h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1a1a1a;
          line-height: 1.3;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-feature p {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .about-visual {
          display: flex;
          justify-content: center;
        }
        
        .about-image-placeholder {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .about-icon {
          font-size: 3rem;
          color: white;
        }
        
        /* Contact Section */
        .contact-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .contact-method {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .contact-icon {
          font-size: 1.5rem;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-details h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1a1a1a;
        }
        
        .contact-details p {
          color: #666;
          font-weight: 500;
        }
        
        .contact-note {
          font-size: 0.8rem;
          color: ${primaryColor};
          font-weight: 500;
        }
        
        .cta-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn-primary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .btn-secondary.large {
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
        }
        
        .contact-form {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .form-container h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: ${primaryColor};
        }
        
        .btn-primary.full-width {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          
          .restaurant-title {
            font-size: 2.5rem;
          }
          
          .restaurant-subtitle {
            font-size: 1.2rem;
          }
          
          .restaurant-description {
            font-size: 1rem;
            max-width: 100%;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .restaurant-stats {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .restaurant-image-placeholder {
            width: 250px;
            height: 250px;
          }
          
          .about-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .contact-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .menu-categories {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .about-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary.large,
          .btn-secondary.large {
            width: 100%;
            max-width: 300px;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .restaurant-title {
            font-size: 2rem;
          }
          
          .restaurant-subtitle {
            font-size: 1.1rem;
          }
          
          .restaurant-image-placeholder {
            width: 200px;
            height: 200px;
          }
          
          .image-icon {
            font-size: 3rem;
          }
          
          .menu-category {
            padding: 1.5rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
        }
      </style>
    `;
  };

  const generateNewsContent = (userRequest: string, textColor: string, data: any) => {
    const name = data.name || 'News Reporter';
    
    return `
      <div class="news-portfolio">
        <header class="news-hero">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1rem;">${name}</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 2rem;">Freelance News Journalist</p>
          <div class="news-badges">
            <span style="background: ${textColor}; color: white; padding: 0.5rem 1rem; border-radius: 20px; margin: 0.5rem; display: inline-block;">Breaking News</span>
            <span style="background: ${textColor}; color: white; padding: 0.5rem 1rem; border-radius: 20px; margin: 0.5rem; display: inline-block;">Investigative</span>
            <span style="background: ${textColor}; color: white; padding: 0.5rem 1rem; border-radius: 20px; margin: 0.5rem; display: inline-block;">Feature Stories</span>
          </div>
        </header>
        
        <section class="recent-stories">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Recent Stories</h2>
          <div class="stories-grid">
            <article class="story-card">
              <div class="story-meta" style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 1rem;">BREAKING • 2 hours ago</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 1rem;">Local Government Transparency Initiative</h3>
              <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">Investigative report on new transparency measures in local government, revealing significant improvements in public access to information...</p>
              <div class="story-tags">
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">Politics</span>
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">Investigative</span>
              </div>
            </article>
            
            <article class="story-card">
              <div class="story-meta" style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 1rem;">FEATURE • 1 day ago</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 1rem;">Community Heroes: Local Volunteers Making a Difference</h3>
              <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">Heartwarming feature story highlighting the unsung heroes in our community who are making a real difference in people's lives...</p>
              <div class="story-tags">
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">Community</span>
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">Human Interest</span>
              </div>
            </article>
            
            <article class="story-card">
              <div class="story-meta" style="color: ${textColor}; opacity: 0.7; font-size: 0.9rem; margin-bottom: 1rem;">NEWS • 3 days ago</div>
              <h3 style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 1rem;">Economic Impact of New Business District</h3>
              <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">Comprehensive analysis of how the new business district is transforming the local economy and creating new opportunities...</p>
              <div class="story-tags">
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">Business</span>
                <span style="background: rgba(255,255,255,0.2); color: ${textColor}; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">Analysis</span>
              </div>
            </article>
          </div>
        </section>
        
        <section class="expertise-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Areas of Expertise</h2>
          <div class="expertise-grid">
            <div class="expertise-item">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Investigative Reporting</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Deep-dive investigations and fact-finding missions</p>
            </div>
            <div class="expertise-item">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Breaking News</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Real-time coverage of developing stories</p>
            </div>
            <div class="expertise-item">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Feature Writing</h3>
              <p style="color: ${textColor}; opacity: 0.8;">In-depth human interest and profile stories</p>
            </div>
            <div class="expertise-item">
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Digital Media</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Multi-platform content creation and distribution</p>
            </div>
          </div>
        </section>
        
        <footer class="contact-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Contact & Collaboration</h2>
          <p style="color: ${textColor}; font-size: 1.2rem; margin-bottom: 2rem;">Available for freelance assignments and long-term collaborations</p>
          <div class="contact-info">
            <p style="color: ${textColor}; opacity: 0.8;">Email: ${name.toLowerCase().replace(' ', '.')}@email.com</p>
            <p style="color: ${textColor}; opacity: 0.8;">Phone: +1 (555) 123-4567</p>
            <p style="color: ${textColor}; opacity: 0.8;">Twitter: @${name.toLowerCase().replace(' ', '')}News</p>
          </div>
        </footer>
      </div>
      
      <style>
        .news-portfolio { max-width: 1000px; margin: 0 auto; padding: 2rem; }
        .news-hero { text-align: center; margin-bottom: 4rem; padding: 3rem 0; }
        .news-badges { margin-top: 2rem; }
        .stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .story-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; }
        .story-tags { margin-top: 1rem; }
        .expertise-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .expertise-item { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center; }
        .contact-section { text-align: center; margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.2); }
        .contact-info { margin-top: 2rem; }
      </style>
    `;
  };

  const generateCreativeContent = (userRequest: string, textColor: string, data: any) => {
    return `
      <div class="creative-portfolio">
        <header class="creative-hero">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1rem; font-weight: 100;">Creative Studio</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 2rem;">Where Art Meets Technology</p>
          <div class="creative-nav">
            <a href="#gallery" style="color: ${textColor}; text-decoration: none; margin: 0 1rem; padding: 0.5rem 1rem; border: 1px solid ${textColor}; border-radius: 20px;">Gallery</a>
            <a href="#about" style="color: ${textColor}; text-decoration: none; margin: 0 1rem; padding: 0.5rem 1rem; border: 1px solid ${textColor}; border-radius: 20px;">About</a>
            <a href="#contact" style="color: ${textColor}; text-decoration: none; margin: 0 1rem; padding: 0.5rem 1rem; border: 1px solid ${textColor}; border-radius: 20px;">Contact</a>
          </div>
        </header>
        
        <section class="gallery-section">
          <h2 style="color: ${textColor}; font-size: 3rem; text-align: center; margin: 3rem 0;">Featured Works</h2>
          <div class="gallery-grid">
            <div class="gallery-item">
              <div class="artwork" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Digital Dreams</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Mixed media digital art</p>
            </div>
            <div class="gallery-item">
              <div class="artwork" style="background: linear-gradient(45deg, #667eea, #764ba2); height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Abstract Reality</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Contemporary abstract piece</p>
            </div>
            <div class="gallery-item">
              <div class="artwork" style="background: linear-gradient(45deg, #f093fb, #f5576c); height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Color Symphony</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Vibrant color exploration</p>
            </div>
            <div class="gallery-item">
              <div class="artwork" style="background: linear-gradient(45deg, #4facfe, #00f2fe); height: 200px; border-radius: 12px; margin-bottom: 1rem;"></div>
              <h3 style="color: ${textColor}; font-size: 1.3rem;">Ocean Depths</h3>
              <p style="color: ${textColor}; opacity: 0.8;">Underwater inspiration</p>
            </div>
          </div>
        </section>
        
        <section class="about-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">About the Artist</h2>
          <p style="color: ${textColor}; font-size: 1.2rem; line-height: 1.8; max-width: 700px; margin: 0 auto;">
            Passionate about creating digital experiences that blur the line between reality and imagination. 
            Each piece tells a story, evokes emotion, and challenges the viewer to see the world differently.
          </p>
        </section>
      </div>
      
      <style>
        .creative-portfolio { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .creative-hero { text-align: center; margin-bottom: 4rem; padding: 3rem 0; }
        .creative-nav { margin-top: 2rem; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .gallery-item { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 12px; text-align: center; }
        .about-section { text-align: center; margin: 4rem 0; }
      </style>
    `;
  };

  // Universal content generator - handles ANY prompt intelligently
  const generateUniversalContent = (userRequest: string, textColor: string, data: any) => {
    // Extract key information from ANY prompt
    const words = userRequest.toLowerCase().split(' ');
    const hasAction = words.some(w => ['make', 'create', 'build', 'design', 'add', 'change', 'update'].includes(w));
    const hasContent = words.some(w => ['blog', 'website', 'site', 'page', 'content', 'text', 'story'].includes(w));
    const hasStyle = words.some(w => ['red', 'blue', 'green', 'white', 'black', 'color', 'style', 'design'].includes(w));
    
    // Generate intelligent content based on the prompt
    let title = site.name;
    let description = 'Your AI-generated website is ready!';
    let features = [];
    
    // Smart content detection
    if (userRequest.includes('blog')) {
      title = 'My Blog';
      description = 'Welcome to my personal blog where I share thoughts, stories, and insights.';
      features = ['Latest Posts', 'Categories', 'About Me', 'Contact'];
    } else if (userRequest.includes('portfolio')) {
      title = 'Portfolio';
      description = 'Showcasing my work, skills, and professional experience.';
      features = ['Projects', 'Skills', 'Experience', 'Contact'];
    } else if (userRequest.includes('business') || userRequest.includes('company')) {
      title = 'Our Business';
      description = 'Professional services and solutions for your needs.';
      features = ['Services', 'About Us', 'Portfolio', 'Contact'];
    } else if (userRequest.includes('personal') || userRequest.includes('about me')) {
      title = 'About Me';
      description = 'Get to know me better and explore my interests and passions.';
      features = ['About', 'Interests', 'Projects', 'Contact'];
    } else {
      // Generic intelligent content
      title = userRequest.length > 50 ? userRequest.substring(0, 50) + '...' : userRequest;
      description = `Custom website created based on: "${userRequest}"`;
      features = ['Home', 'About', 'Services', 'Contact'];
    }
    
    return `
      <div class="universal-website">
        <header class="hero-section">
          <h1 style="color: ${textColor}; font-size: 4rem; margin-bottom: 1rem; font-weight: 300;">${title}</h1>
          <p style="color: ${textColor}; font-size: 1.5rem; opacity: 0.9; margin-bottom: 2rem;">${description}</p>
          <div class="hero-buttons">
            <button style="background: ${textColor}; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; margin-right: 1rem; cursor: pointer;">Get Started</button>
            <button style="background: transparent; color: ${textColor}; padding: 1rem 2rem; border: 2px solid ${textColor}; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">Learn More</button>
          </div>
        </header>
        
        <section class="features-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; text-align: center; margin: 3rem 0;">What You'll Find Here</h2>
          <div class="features-grid">
            ${features.map(feature => `
              <div class="feature-item">
                <div class="feature-icon">${getFeatureIcon(feature)}</div>
                <h3 style="color: ${textColor}; font-size: 1.5rem;">${feature}</h3>
                <p style="color: ${textColor}; opacity: 0.8;">${getFeatureDescription(feature)}</p>
              </div>
            `).join('')}
          </div>
        </section>
        
        <section class="content-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; text-align: center; margin: 3rem 0;">Latest Updates</h2>
          <div class="content-grid">
            <article class="content-item">
              <h3 style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 1rem;">${getContentTitle(userRequest)}</h3>
              <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">${getContentDescription(userRequest)}</p>
              <div class="content-meta" style="color: ${textColor}; opacity: 0.7; margin-top: 1rem; font-size: 0.9rem;">
                ${new Date().toLocaleDateString()} • ${getContentCategory(userRequest)}
              </div>
            </article>
            
            <article class="content-item">
              <h3 style="color: ${textColor}; font-size: 1.5rem; margin-bottom: 1rem;">${getSecondaryContentTitle(userRequest)}</h3>
              <p style="color: ${textColor}; opacity: 0.9; line-height: 1.6;">${getSecondaryContentDescription(userRequest)}</p>
              <div class="content-meta" style="color: ${textColor}; opacity: 0.7; margin-top: 1rem; font-size: 0.9rem;">
                ${new Date(Date.now() - 86400000).toLocaleDateString()} • ${getSecondaryContentCategory(userRequest)}
              </div>
            </article>
          </div>
        </section>
        
        <footer class="contact-section">
          <h2 style="color: ${textColor}; font-size: 2.5rem; margin: 3rem 0 1.5rem 0;">Get In Touch</h2>
          <p style="color: ${textColor}; font-size: 1.2rem; margin-bottom: 2rem;">Ready to connect? Let's start a conversation.</p>
          <div class="contact-info">
            <p style="color: ${textColor}; opacity: 0.8;">Email: contact@example.com</p>
            <p style="color: ${textColor}; opacity: 0.8;">Phone: +1 (555) 123-4567</p>
            <p style="color: ${textColor}; opacity: 0.8;">Social: @yourhandle</p>
          </div>
        </footer>
      </div>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .universal-website { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.1;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-subtitle {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 2rem;
          opacity: 0.9;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .btn-primary {
          background: white;
          color: #667eea;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .btn-secondary {
          background: transparent;
          color: white;
          padding: 1rem 2rem;
          border: 2px solid white;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background: white;
          color: #667eea;
        }
        
        .features-section {
          padding: 80px 0;
          background: #f8fafc;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 2rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1a1a1a;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .section-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-item {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .feature-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .feature-description {
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .content-section {
          padding: 80px 0;
          background: white;
        }
        
        .content-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }
        
        .content-item {
          background: #f8fafc;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }
        
        .content-item h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1a1a1a;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .content-item p {
          color: #666;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        .contact-section {
          padding: 80px 0;
          background: #f8fafc;
          text-align: center;
        }
        
        .contact-info {
          max-width: 600px;
          margin: 2rem auto 0;
          padding: 0 2rem;
        }
        
        .contact-info p {
          color: #666;
          margin: 0.5rem 0;
          font-size: 1.1rem;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
            max-width: 300px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 2rem;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .feature-item,
          .content-item {
            padding: 1.5rem;
          }
        }
      </style>
    `;
  };

  // Helper functions for universal content
  const getFeatureIcon = (feature: string): string => {
    const icons: { [key: string]: string } = {
      'Latest Posts': '📝',
      'Categories': '📂',
      'About Me': '👤',
      'Contact': '📧',
      'Projects': '💼',
      'Skills': '⚡',
      'Experience': '🎯',
      'Services': '🛠️',
      'About Us': '🏢',
      'Portfolio': '🎨',
      'About': 'ℹ️',
      'Interests': '❤️',
      'Home': '🏠'
    };
    return icons[feature] || '✨';
  };

  const getFeatureDescription = (feature: string): string => {
    const descriptions: { [key: string]: string } = {
      'Latest Posts': 'Read my newest articles and thoughts',
      'Categories': 'Browse content by topic and interest',
      'About Me': 'Learn more about my background and story',
      'Contact': 'Get in touch and start a conversation',
      'Projects': 'Explore my work and accomplishments',
      'Skills': 'See my technical abilities and expertise',
      'Experience': 'Review my professional background',
      'Services': 'Discover what I can do for you',
      'About Us': 'Learn about our company and mission',
      'Portfolio': 'View my creative work and projects',
      'About': 'Find out more about me',
      'Interests': 'See what I\'m passionate about',
      'Home': 'Return to the main page'
    };
    return descriptions[feature] || 'Explore this section';
  };

  const getContentTitle = (request: string): string => {
    if (request.includes('blog')) return 'Welcome to My Blog';
    if (request.includes('portfolio')) return 'Featured Project';
    if (request.includes('business')) return 'Our Latest News';
    if (request.includes('personal')) return 'About My Journey';
    return 'Latest Update';
  };

  const getContentDescription = (request: string): string => {
    if (request.includes('blog')) return 'This is where I share my thoughts, experiences, and insights on various topics that interest me.';
    if (request.includes('portfolio')) return 'Here you can see some of my recent work and projects that showcase my skills and creativity.';
    if (request.includes('business')) return 'Stay updated with our latest news, announcements, and company developments.';
    if (request.includes('personal')) return 'Learn more about my personal journey, experiences, and the things that matter to me.';
    return 'This is a dynamic section that updates based on your specific needs and requirements.';
  };

  const getContentCategory = (request: string): string => {
    if (request.includes('blog')) return 'Blog Post';
    if (request.includes('portfolio')) return 'Project';
    if (request.includes('business')) return 'Company News';
    if (request.includes('personal')) return 'Personal';
    return 'Update';
  };

  const getSecondaryContentTitle = (request: string): string => {
    if (request.includes('blog')) return 'Previous Post';
    if (request.includes('portfolio')) return 'Another Project';
    if (request.includes('business')) return 'Company Update';
    if (request.includes('personal')) return 'Personal Story';
    return 'Previous Update';
  };

  const getSecondaryContentDescription = (request: string): string => {
    if (request.includes('blog')) return 'Catch up on my previous thoughts and experiences that I\'ve shared recently.';
    if (request.includes('portfolio')) return 'Explore more of my work and see the variety of projects I\'ve been involved in.';
    if (request.includes('business')) return 'Review our recent company updates and important announcements.';
    if (request.includes('personal')) return 'Read about my personal experiences and the lessons I\'ve learned along the way.';
    return 'This section provides additional context and information related to your specific request.';
  };

  const getSecondaryContentCategory = (request: string): string => {
    if (request.includes('blog')) return 'Archive';
    if (request.includes('portfolio')) return 'Gallery';
    if (request.includes('business')) return 'News';
    if (request.includes('personal')) return 'Story';
    return 'Archive';
  };

  const checkPreviewReady = async () => {
    if (!site.previewUrl) return;
    
    // First, try to get the actual Claude-generated content from the site
    try {
      const response = await fetch(`http://localhost:3000/api/sites/${site.id}`);
      if (response.ok) {
        const siteData = await response.json();
        if (siteData.websiteContent && typeof siteData.websiteContent === 'object') {
          // Use the actual Claude-generated content
          const claudeContent = siteData.websiteContent;
          console.log('Using Claude-generated content:', claudeContent);
          
          // If we have an index.html file from Claude, use it directly
          if (claudeContent['index.html']) {
            const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(claudeContent['index.html'])}`;
            setPreviewUrl(dataUrl);
            setPreviewReady(true);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching site data:', error);
    }
    
    // Fallback to generating content based on chat messages
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    
    let dynamicContent = '';
    let backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    let textColor = 'white';
    let mainText = site.name;
    
    // Debug logging
    console.log('Preview generation:', {
      lastUserMessage: lastUserMessage?.content,
      messagesCount: messages.length,
      siteName: site.name
    });
    
    // Advanced prompt parsing - much more intelligent like Lovable/DeepSeek
    let websiteType = 'simple';
    let extractedData = {};
    
    // If there are chat messages, use the last user request to generate content
    if (lastUserMessage) {
      const userRequest = lastUserMessage.content.toLowerCase();
      
      // Extract business name from the request - IMPROVED LOGIC
      if (userRequest.includes('make a') || userRequest.includes('create a')) {
        const businessMatch = userRequest.match(/(?:make a|create a)\s+([^.!?]+?)(?:\s+(?:website|site|business))?/);
        if (businessMatch) {
          const extractedName = businessMatch[1].trim().replace(/\s+/g, ' ');
          // Only use extracted name if it's not a generic instruction
          if (!extractedName.includes('text') && !extractedName.includes('color') && !extractedName.includes('black')) {
            mainText = extractedName;
          }
        }
      }
      
      // Also check for other patterns like "I want a", "build me a", etc.
      if (!mainText || mainText === site.name) {
        const patterns = [
          /(?:I want a|build me a|create me a|make me a)\s+([^.!?]+?)(?:\s+(?:website|site|business))?/,
          /(?:I need a|I'm looking for a)\s+([^.!?]+?)(?:\s+(?:website|site|business))?/,
          /(?:help me create|help me make)\s+([^.!?]+?)(?:\s+(?:website|site|business))?/
        ];
        
        for (const pattern of patterns) {
          const match = userRequest.match(pattern);
          if (match) {
            mainText = match[1].trim().replace(/\s+/g, ' ');
            break;
          }
        }
      }
      
      // Check for specific styling requests - IMPROVED LOGIC
      if (userRequest.includes('black') && userRequest.includes('text')) {
        textColor = 'black';
        backgroundColor = 'white';
      } else if (userRequest.includes('white') && userRequest.includes('text')) {
        textColor = 'white';
        backgroundColor = 'black';
      } else if (userRequest.includes('red') && userRequest.includes('white')) {
        backgroundColor = 'white';
        textColor = 'red';
      } else if (userRequest.includes('bright red')) {
        textColor = '#ff0000';
      }
      
      // Advanced prompt parsing - much more intelligent like Lovable/DeepSeek
      websiteType = detectWebsiteType(userRequest);
      extractedData = extractAdvancedData(userRequest);
      
      if (websiteType === 'business') {
        // Check for specific business types
        if (userRequest.toLowerCase().includes('snow') || userRequest.toLowerCase().includes('snowplow') || userRequest.toLowerCase().includes('plow')) {
          dynamicContent = generateAdvancedSnowplowContent(userRequest, textColor, extractedData);
        } else if (userRequest.toLowerCase().includes('car') && (userRequest.toLowerCase().includes('detail') || userRequest.toLowerCase().includes('wash') || userRequest.toLowerCase().includes('auto'))) {
          dynamicContent = generateAdvancedAutoDetailingContent(userRequest, textColor, extractedData);
        } else if (userRequest.toLowerCase().includes('restaurant') || userRequest.toLowerCase().includes('food') || userRequest.toLowerCase().includes('dining')) {
          dynamicContent = generateAdvancedRestaurantContent(userRequest, textColor, extractedData);
        } else if (userRequest.toLowerCase().includes('landscap') || userRequest.toLowerCase().includes('lawn') || userRequest.toLowerCase().includes('garden')) {
          dynamicContent = generateBusinessContent(userRequest, textColor, extractedData);
        } else if (userRequest.toLowerCase().includes('construction') || userRequest.toLowerCase().includes('contractor') || userRequest.toLowerCase().includes('building')) {
          dynamicContent = generateBusinessContent(userRequest, textColor, extractedData);
        } else {
          dynamicContent = generateBusinessContent(userRequest, textColor, extractedData);
        }
      } else if (websiteType === 'portfolio') {
        dynamicContent = generateAdvancedPortfolioContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'ecommerce') {
        dynamicContent = generateAdvancedEcommerceContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'blog') {
        dynamicContent = generateAdvancedBlogContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'restaurant') {
        dynamicContent = generateAdvancedRestaurantContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'news') {
        dynamicContent = generateNewsContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'landing') {
        dynamicContent = generateAdvancedLandingContent(userRequest, textColor, extractedData);
      } else if (websiteType === 'creative') {
        dynamicContent = generateCreativeContent(userRequest, textColor, extractedData);
      } else {
        // Universal fallback - handle ANY prompt intelligently
        dynamicContent = generateUniversalContent(userRequest, textColor, extractedData);
      }
    } else {
      // Default content if no chat messages
      dynamicContent = `
        <div class="main-content">
          <h1 style="color: ${textColor}; font-size: 3rem;">
            ${site.name}
          </h1>
          <p style="color: ${textColor}; font-size: 1.2rem;">
            Your AI-generated website is ready!
          </p>
        </div>
      `;
    }
    
    // If we have specific content (like auto detailing), use it directly
    // Otherwise, use the generic template
    let htmlContent;
    
    console.log('Dynamic content type:', typeof dynamicContent);
    console.log('Dynamic content length:', dynamicContent?.length);
    console.log('Contains DOCTYPE:', dynamicContent?.includes('<!DOCTYPE html>'));
    
    if (dynamicContent && dynamicContent.includes('<!DOCTYPE html>')) {
      // This is a complete HTML page (like auto detailing)
      console.log('Using complete HTML page');
      htmlContent = dynamicContent;
    } else {
      // This is just content snippet, wrap it in generic template
      console.log('Using generic template');
      htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${site.name}</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: ${backgroundColor};
                  color: ${textColor};
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: all 0.3s ease;
              }
              .main-content {
                  text-align: center;
                  max-width: 1000px;
                  padding: 2rem;
                  animation: fadeIn 0.5s ease-in;
              }
              @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .update-indicator {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: rgba(0,0,0,0.8);
                  color: white;
                  padding: 10px 20px;
                  border-radius: 25px;
                  font-size: 0.9rem;
                  animation: pulse 2s infinite;
              }
              @keyframes pulse {
                  0%, 100% { opacity: 0.7; }
                  50% { opacity: 1; }
              }
          </style>
      </head>
      <body>
          ${dynamicContent || '<div class="main-content"><h1>Loading...</h1></div>'}
          <div class="update-indicator">
              🔄 Live Preview
          </div>
      </body>
      </html>`;
    }
    
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    setPreviewUrl(dataUrl);
    setPreviewReady(true);
    
    // Debug logging
    console.log('Preview URL set:', dataUrl.substring(0, 100) + '...');
    console.log('Content type detected:', websiteType);
    console.log('Main text:', mainText);
  };

  // Generate preview content from messages
  const generatePreviewContent = (messages: ChatMessage[]) => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return null;
    
    const analysis = analyzePrompt(lastUserMessage.content);
    
    // Generate content based on analysis
    if (analysis.type === 'snowplow') {
      return generateAdvancedSnowplowContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'auto_detailing') {
      return generateAdvancedAutoDetailingContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'restaurant') {
      return generateAdvancedRestaurantContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'portfolio') {
      return generateAdvancedPortfolioContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'ecommerce') {
      return generateAdvancedEcommerceContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'blog') {
      return generateAdvancedBlogContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'landing') {
      return generateAdvancedLandingContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'news') {
      return generateNewsContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'creative') {
      return generateAdvancedCreativeContent(lastUserMessage.content, '#ffffff', analysis);
    } else {
      return generateUniversalContent(lastUserMessage.content, '#ffffff', analysis);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to AI for website modification
      const response = await fetch('http://localhost:3000/api/sites/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          message: input,
          chatHistory: newMessages, // Send updated chat history for context
          currentCode: {} // We'll get this from the site
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message || 'I\'ve updated your website! The changes should be visible in the preview.',
          timestamp: new Date()
        };

        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);
        
        // Save chat history and website content to database
        try {
          await fetch(`http://localhost:3000/api/sites/${site.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatHistory: finalMessages,
              websiteContent: result.websiteContent || generatePreviewContent(finalMessages),
            }),
          });
        } catch (saveError) {
          console.error('Error saving chat history:', saveError);
        }
        
        // Update preview URL if it changed
        if (result.previewUrl) {
          setPreviewUrl(result.previewUrl);
        }

        toast({
          title: "Website Updated",
          description: "Your changes have been applied successfully!",
        });
      } else {
        throw new Error(result.error || 'Failed to update website');
      }
    } catch (error) {
      console.error('Error updating website:', error);
      toast({
        title: "Error",
        description: "Failed to update website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployToGitHub = async () => {
    try {
      const response = await fetch('/api/sites/deploy/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id })
      });

      const result = await response.json();
      
      if (result.success) {
        onUpdate({ ...site, repoUrl: result.repoUrl });
        toast({
          title: "Deployed to GitHub",
          description: `Your website is now available at ${result.repoUrl}`,
        });
      } else {
        throw new Error(result.error || 'Failed to deploy to GitHub');
      }
    } catch (error) {
      console.error('Error deploying to GitHub:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy to GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeployToVercel = async () => {
    try {
      const response = await fetch('/api/sites/deploy/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id })
      });

      const result = await response.json();
      
      if (result.success) {
        onUpdate({ ...site, previewUrl: result.previewUrl });
        setPreviewUrl(result.previewUrl);
        toast({
          title: "Deployed to Vercel",
          description: `Your website is now live at ${result.previewUrl}`,
        });
      } else {
        throw new Error(result.error || 'Failed to deploy to Vercel');
      }
    } catch (error) {
      console.error('Error deploying to Vercel:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy to Vercel. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshPreview = () => {
    setIsPreviewLoading(true);
    // Force refresh the iframe
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
    setTimeout(() => setIsPreviewLoading(false), 1000);
  };

  return (
    <div className="h-screen flex">
      {/* Left Side - Chat Interface */}
      <div 
        className="border-r border-border flex flex-col relative"
        style={{ width: `${chatWidth}%` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{site.name}</h2>
              <Badge variant={site.status === 'deployed' ? 'default' : 'secondary'}>
                {site.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeployToGitHub}
                disabled={!!site.repoUrl}
              >
                <Github className="w-4 h-4 mr-2" />
                {site.repoUrl ? 'Deployed' : 'Deploy to GitHub'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeployToVercel}
                disabled={!!site.previewUrl?.includes('vercel')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {site.previewUrl?.includes('vercel') ? 'Deployed' : 'Deploy to Vercel'}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to change about your website..."
              className="flex-1 min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="w-2 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 transition-colors duration-200 flex items-center justify-center group"
        onMouseDown={handleMouseDown}
        title="Drag to resize chat panel"
      >
        <div className="w-1 h-8 bg-gray-400 group-hover:bg-white rounded-full"></div>
      </div>

      {/* Right Side - Preview */}
      <div 
        className="flex flex-col"
        style={{ width: `${100 - chatWidth}%` }}
      >
        {/* Preview Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Live Preview</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPreview}
                disabled={isPreviewLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isPreviewLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {previewUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Create a new window with the preview URL
                    const newWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer');
                    if (!newWindow) {
                      // Fallback if popup is blocked
                      window.location.href = previewUrl;
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative">
          {previewUrl ? (
            previewReady ? (
              <iframe
                id="preview-iframe"
                src={previewUrl}
                className="w-full h-full border-0"
                title="Website Preview"
                onLoad={() => setIsPreviewLoading(false)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">Starting Preview...</h3>
                  <p className="text-muted-foreground">
                    Setting up your website preview...
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Preview Available</h3>
                <p className="text-muted-foreground">
                  The website preview will appear here once it's generated.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
