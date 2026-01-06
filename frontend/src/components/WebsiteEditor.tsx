import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { fetchWithAuth } from '@/lib/fetchWithAuth';

interface WebsiteEditorProps {
  site: {
    id: string;
    name: string;
    slug: string;
    status: string;
    previewUrl?: string;
    repoUrl?: string;
    websiteContent?: Record<string, string>; // Add websiteContent prop
  };
  onUpdate: (site: any) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Fix broken image URLs in HTML content
// List of reliable Unsplash image IDs that we know work
const FALLBACK_IMAGE_IDS = [
  '1522071820080-37f2cb85c41d', // Business/Office
  '1497366216548-37526070297c', // Modern workspace
  '1556761175-4bda37b9dd37', // Business meeting
  '1556761175-b4136fa58510', // Team collaboration
  '1552664736-d46ed1db83d9', // Professional
  '1556761175-5973dc0f32e7', // Business
  '1556761175-5973dc0f32e8', // Office
  '1556761175-5973dc0f32e9', // Team
  '1556761175-5973dc0f32ea', // Technology
  '1556761175-5973dc0f32eb', // Success
];

function fixImageUrls(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Fix broken Unsplash URLs in src attributes
  const brokenSrcPattern = /src=["'](photo-\d+-\d+[^"']*)["']/gi;
  html = html.replace(brokenSrcPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `src="https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop"`;
  });
  
  // Fix broken Unsplash URLs in CSS url() functions
  const brokenUrlPattern = /url\(["']?(photo-\d+-\d+[^"')]*)["']?\)/gi;
  html = html.replace(brokenUrlPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `url("https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix broken Unsplash URLs in background-image CSS
  const brokenBgPattern = /background-image:\s*url\(["']?(photo-\d+-\d+[^"')]*)["']?\)/gi;
  html = html.replace(brokenBgPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `background-image: url("https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix URLs in quotes that are just photo IDs (catch-all)
  const brokenQuotedPattern = /(["'])(photo-\d+-\d+[^"']*)(["'])/g;
  html = html.replace(brokenQuotedPattern, (match, quote1, photoId, quote2) => {
    // Skip if it's already part of a fixed URL
    if (photoId.includes('images.unsplash.com')) return match;
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `${quote1}https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop${quote2}`;
  });
  
  // Add image error handler script to the HTML
  // This will try fallback images if the original fails to load
  if (html.includes('</body>') || html.includes('</html>')) {
    const imageErrorHandler = `
<script>
(function() {
  const fallbackImages = ${JSON.stringify(FALLBACK_IMAGE_IDS)};
  let fallbackIndex = 0;
  
  function getFallbackImageUrl() {
    if (fallbackIndex >= fallbackImages.length) {
      fallbackIndex = 0; // Reset to start
    }
    const imageId = fallbackImages[fallbackIndex];
    fallbackIndex++;
    return 'https://images.unsplash.com/' + imageId + '?w=800&h=600&fit=crop';
  }
  
  function handleImageError(img) {
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    
    // If we haven't tried fallbacks yet, save original src
    if (!img.getAttribute('data-original-src')) {
      img.setAttribute('data-original-src', originalSrc);
      img.setAttribute('data-fallback-attempts', '0');
    }
    
    const attempts = parseInt(img.getAttribute('data-fallback-attempts') || '0');
    
    // Try up to 5 fallback images
    if (attempts < 5) {
      img.setAttribute('data-fallback-attempts', (attempts + 1).toString());
      img.src = getFallbackImageUrl();
      console.log('🔄 Trying fallback image', attempts + 1, 'for:', originalSrc);
    } else {
      console.warn('⚠️ All fallback images failed for:', originalSrc);
      // Hide broken images after all attempts fail
      img.style.display = 'none';
    }
  }
  
  // Handle existing images
  document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.onerror) {
        img.onerror = function() { handleImageError(img); };
      }
    });
  });
  
  // Handle dynamically added images
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG') {
            node.onerror = function() { handleImageError(node); };
          }
          // Also check for images inside added nodes
          const images = node.querySelectorAll && node.querySelectorAll('img');
          if (images) {
            images.forEach(function(img) {
              if (!img.onerror) {
                img.onerror = function() { handleImageError(img); };
              }
            });
          }
        }
      });
    });
  });
  
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
</script>`;
    
    // Insert before </body> or </html>
    if (html.includes('</body>')) {
      html = html.replace('</body>', imageErrorHandler + '</body>');
    } else if (html.includes('</html>')) {
      html = html.replace('</html>', imageErrorHandler + '</html>');
    }
  }
  
  return html;
}

export const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ site, onUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(site.previewUrl);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // Force iframe reload when content changes
  const [chatWidth, setChatWidth] = useState(40); // Default 40% width
  const [isResizing, setIsResizing] = useState(false);
  const [currentWebsiteContent, setCurrentWebsiteContent] = useState<Record<string, string>>((site as any).websiteContent || {});
  const [currentPage, setCurrentPage] = useState<string>('index.html'); // Multi-page support
  const [generationProgress, setGenerationProgress] = useState<{step: string; detail: string; percent: number} | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Get list of available pages (HTML files)
  const availablePages = Object.keys(currentWebsiteContent).filter(
    key => key.endsWith('.html') && currentWebsiteContent[key]?.includes('<!DOCTYPE')
  ).sort((a, b) => {
    // Sort: index.html first, then alphabetically
    if (a === 'index.html') return -1;
    if (b === 'index.html') return 1;
    return a.localeCompare(b);
  });
  
  // Ensure currentPage exists in available pages
  const effectiveCurrentPage = availablePages.includes(currentPage) ? currentPage : (availablePages[0] || 'index.html');

  // Inject navigation script into HTML to enable clicking nav links
  const injectNavigationScript = (html: string): string => {
    const navScript = `
<script>
// Intercept all link clicks for in-preview navigation
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (target && target.href) {
    const href = target.getAttribute('href');
    // Check if it's an internal .html page link
    if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
      e.preventDefault();
      // Post message to parent to switch pages
      window.parent.postMessage({ type: 'navigate', page: href }, '*');
    }
  }
});
</script>
`;
    // Inject before </body> if it exists, otherwise before </html>
    if (html.includes('</body>')) {
      return html.replace('</body>', navScript + '</body>');
    } else if (html.includes('</html>')) {
      return html.replace('</html>', navScript + '</html>');
    }
    return html + navScript;
  };

  // Listen for navigation messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'navigate' && event.data.page) {
        const page = event.data.page;
        console.log('🔗 Navigation request from iframe:', page);
        // Check if the page exists in our content
        if (currentWebsiteContent[page]) {
          setCurrentPage(page);
        } else {
          console.warn('Page not found:', page, 'Available:', Object.keys(currentWebsiteContent));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentWebsiteContent]);

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
  // For new sites (status: 'generating'), show prompt to generate website
  useEffect(() => {
    // If websiteContent is passed directly in site prop, use it immediately for instant preview
    if (site.websiteContent && typeof site.websiteContent === 'object' && Object.keys(site.websiteContent).length > 0) {
      console.log('✅ Using websiteContent from site prop (instant preview)', Object.keys(site.websiteContent));
      setCurrentWebsiteContent(site.websiteContent);
      // Generate preview immediately - no API call needed
      checkPreviewReady();
    }
    
    const loadSiteData = async () => {
      // Skip if site.id is not available yet
      if (!site.id) {
        const welcomeMessage = site.status === 'generating' || !site.previewUrl
          ? `Hello! I'm your AI assistant powered by Kirin. Describe the website you'd like me to create. For example: "Create a modern landing page for a SaaS product with a hero section, features grid, and pricing cards"`
          : `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`;
        
        setMessages([{
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }]);
        return;
      }
      
      try {
        const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
        const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`);
        if (response.ok) {
          const siteData = await response.json();
          console.log('Loaded site data:', { 
            hasChatHistory: !!siteData.chatHistory, 
            chatHistoryLength: siteData.chatHistory?.length || 0,
            siteId: site.id 
          });
          
          // ALWAYS load chat history and website content if they exist
          if (siteData.chatHistory && Array.isArray(siteData.chatHistory) && siteData.chatHistory.length > 0) {
            // Convert timestamps to Date objects if they're strings
            const formattedMessages = siteData.chatHistory.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? (typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp) : new Date()
            }));
            setMessages(formattedMessages);
            console.log('✅ Chat history loaded:', formattedMessages.length, 'messages');
          }
          
          // ALWAYS load websiteContent if available (even if no chat history)
          if (siteData.websiteContent && typeof siteData.websiteContent === 'object') {
            const contentKeys = Object.keys(siteData.websiteContent);
            // Only process if websiteContent has actual content (not empty object)
            if (contentKeys.length > 0) {
              setCurrentWebsiteContent(siteData.websiteContent);
              // Update the site object with websiteContent
              onUpdate({ ...site, websiteContent: siteData.websiteContent });
              console.log('✅ Website content loaded:', contentKeys.length, 'files', { keys: contentKeys });
              
              // Update preview URL if we have websiteContent - check multiple possible keys
              const htmlContent = siteData.websiteContent['index.html'] || 
                                 siteData.websiteContent['Index.html'] ||
                                 siteData.websiteContent['INDEX.HTML'] ||
                                 Object.values(siteData.websiteContent).find((content: any) => 
                                   typeof content === 'string' && 
                                   (content.includes('<!DOCTYPE') || content.includes('<html') || content.includes('<body'))
                                 ) as string | undefined;
              
              if (htmlContent && htmlContent.trim().length > 0) {
                let cleanedHtml = htmlContent.trim();
                // Clean up any markdown markers
                if (cleanedHtml.startsWith('```')) {
                  cleanedHtml = cleanedHtml.replace(/^```[a-z]*\s*\n?/i, '');
                }
                if (cleanedHtml.endsWith('```')) {
                  cleanedHtml = cleanedHtml.replace(/\n?```$/i, '');
                }
                cleanedHtml = cleanedHtml.trim();
                
                if (cleanedHtml.includes('<!DOCTYPE') || cleanedHtml.includes('<html') || cleanedHtml.includes('<body')) {
                  // Fix broken image URLs before creating blob
                  cleanedHtml = fixImageUrls(cleanedHtml);
                  // Inject navigation script for in-preview link clicking
                  cleanedHtml = injectNavigationScript(cleanedHtml);
                  
                  // Use Blob URL instead of data URL for Safari compatibility
                  // Clean up old blob URL if it exists
                  if (previewUrl && previewUrl.startsWith('blob:')) {
                    try {
                      URL.revokeObjectURL(previewUrl);
                    } catch (e) {
                      // Ignore errors
                    }
                  }
                  
                  const blob = new Blob([cleanedHtml], { type: 'text/html;charset=utf-8' });
                  const blobUrl = URL.createObjectURL(blob);
                  
                  // Force iframe reload
                  const newKey = previewKey + 1;
                  setPreviewKey(newKey);
                  setPreviewUrl(blobUrl);
                  setPreviewReady(false);
                  
              // Ensure iframe loads - don't try to access contentDocument (causes cross-origin error)
              setTimeout(() => {
                const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                if (iframe) {
                  iframe.src = blobUrl;
                  // Blob URLs will render automatically, no need to verify content
                  setPreviewReady(true);
                  setIsPreviewLoading(false);
                  console.log('✅ Preview loaded from saved content', { 
                    htmlLength: cleanedHtml.length, 
                    blobUrl: blobUrl.substring(0, 50) + '...',
                    previewKey: newKey
                  });
                }
              }, 50);
                } else {
                  console.warn('⚠️ HTML content found but invalid:', cleanedHtml.substring(0, 200));
                }
              } else {
                console.warn('⚠️ No HTML content found in websiteContent:', contentKeys);
              }
            } else {
              console.log('⚠️ websiteContent is empty object, skipping preview load');
            }
          }
          
          // Only show welcome message if no chat history exists
          if (!siteData.chatHistory || !Array.isArray(siteData.chatHistory) || siteData.chatHistory.length === 0) {
            // Only set welcome message if no chat history exists
            // For new sites (status: 'generating'), prompt user to describe their website
            const welcomeMessage = site.status === 'generating' || !site.previewUrl
              ? `Hello! I'm your AI assistant powered by Kirin. Describe the website you'd like me to create. For example: "Create a modern landing page for a SaaS product with a hero section, features grid, and pricing cards"`
              : `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`;
            
            setMessages([{
              id: '1',
              role: 'assistant',
              content: welcomeMessage,
              timestamp: new Date()
            }]);
          }
        } else {
          // Fallback to welcome message if site data can't be loaded
          const welcomeMessage = site.status === 'generating' || !site.previewUrl
            ? `Hello! I'm your AI assistant powered by Kirin. Describe the website you'd like me to create. For example: "Create a modern landing page for a SaaS product with a hero section, features grid, and pricing cards"`
            : `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`;
          
          setMessages([{
            id: '1',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        console.error('Error loading site data:', error);
        // Fallback to welcome message
        const welcomeMessage = site.status === 'generating' || !site.previewUrl
          ? `Hello! I'm your AI assistant powered by Kirin. Describe the website you'd like me to create. For example: "Create a modern landing page for a SaaS product with a hero section, features grid, and pricing cards"`
          : `Hello! I'm your AI assistant for "${site.name}". I can help you modify your website. What would you like to change?`;
        
        setMessages([{
          id: '1',
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date()
        }]);
      }
      
      // Always check preview ready (immediately if we have content)
      if (site.previewUrl || (currentWebsiteContent && Object.keys(currentWebsiteContent).length > 0)) {
        checkPreviewReady();
      }
    };

    loadSiteData();
  }, [site.name, site.id, site.websiteContent]); // Include websiteContent to trigger preview when available

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up blob URLs to prevent memory leaks
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Save site data when component unmounts or before page unload
  useEffect(() => {
    const saveOnExit = async () => {
      if (site.id && (messages.length > 0 || Object.keys(currentWebsiteContent).length > 0)) {
        try {
          const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
          await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              chatHistory: messages.map(msg => ({
                ...msg,
                timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : typeof msg.timestamp === 'string' ? msg.timestamp : new Date().toISOString()
              })),
              websiteContent: currentWebsiteContent,
              previewUrl: previewUrl || site.previewUrl,
              status: site.status || 'deployed',
            }),
          });
          console.log('✅ Site saved on exit', { 
            messageCount: messages.length,
            filesCount: Object.keys(currentWebsiteContent).length 
          });
        } catch (error) {
          console.error('❌ Error saving site on exit:', error);
        }
      }
    };

    // Save before page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      saveOnExit();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also save when component unmounts
      saveOnExit();
    };
  }, [site.id, messages, currentWebsiteContent, previewUrl, site.previewUrl, site.status]);

  // Update preview whenever messages change (immediate for faster preview)
  useEffect(() => {
    if (site.previewUrl && messages.length > 0) {
      // Check immediately - no debounce for faster preview
      checkPreviewReady();
    }
  }, [messages]);
  
  // Update preview when current page changes (multi-page support)
  useEffect(() => {
    if (availablePages.length > 1 && currentWebsiteContent && currentWebsiteContent[effectiveCurrentPage]) {
      console.log('📄 Page changed, regenerating preview:', effectiveCurrentPage);
      checkPreviewReady();
    }
  }, [effectiveCurrentPage, availablePages.length]);

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
    // Extract business name from request
    const extractBusinessName = (req: string): string => {
      const lowerReq = req.toLowerCase();
      if (lowerReq.includes('snow') || lowerReq.includes('snowplow') || lowerReq.includes('plow')) {
        return 'Smart Snowplow Co';
      } else if (lowerReq.includes('car') && (lowerReq.includes('detail') || lowerReq.includes('wash') || lowerReq.includes('auto'))) {
        return 'Premium Auto Detailing';
      } else if (lowerReq.includes('restaurant') || lowerReq.includes('food')) {
        return 'Fine Dining Restaurant';
      }
      return 'Business Name';
    };
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
    // First, check if we already have content in currentWebsiteContent (fastest path)
    // This works even without previewUrl
    // Use effectiveCurrentPage for multi-page support
    const pageToShow = effectiveCurrentPage || 'index.html';
    if (currentWebsiteContent && typeof currentWebsiteContent === 'object' && currentWebsiteContent[pageToShow]) {
      let htmlContent = currentWebsiteContent[pageToShow];
      
      // Clean up any markdown markers
      htmlContent = htmlContent.trim();
      if (htmlContent.startsWith('```')) {
        htmlContent = htmlContent.replace(/^```[a-z]*\s*\n?/i, '');
      }
      if (htmlContent.endsWith('```')) {
        htmlContent = htmlContent.replace(/\n?```$/i, '');
      }
      htmlContent = htmlContent.trim();
      
      // Ensure it's valid HTML
      if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html') || htmlContent.includes('<body')) {
        htmlContent = fixImageUrls(htmlContent);
        // Inject navigation script for in-preview link clicking
        htmlContent = injectNavigationScript(htmlContent);
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        
        if (previewUrl && previewUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(previewUrl);
          } catch (e) {}
        }
        
        setPreviewUrl(blobUrl);
        setPreviewReady(true);
        console.log('✅ Preview loaded from currentWebsiteContent (instant)', { htmlLength: htmlContent.length, page: pageToShow });
        return;
      }
    }
    
    // Try to get the actual AI-generated content from the site (with timeout)
    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const siteData = await response.json();
        if (siteData.websiteContent && typeof siteData.websiteContent === 'object') {
          const geminiContent = siteData.websiteContent;
          console.log('Using AI-generated content from API:', geminiContent);
          
          if (geminiContent['index.html']) {
            let htmlContent = geminiContent['index.html'];
            htmlContent = htmlContent.trim();
            if (htmlContent.startsWith('```')) {
              htmlContent = htmlContent.replace(/^```[a-z]*\s*\n?/i, '');
            }
            if (htmlContent.endsWith('```')) {
              htmlContent = htmlContent.replace(/\n?```$/i, '');
            }
            htmlContent = htmlContent.trim();
            
            if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html') || htmlContent.includes('<body')) {
              htmlContent = fixImageUrls(htmlContent);
              // Inject navigation script for in-preview link clicking
              htmlContent = injectNavigationScript(htmlContent);
              const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
              const blobUrl = URL.createObjectURL(blob);
              
              if (previewUrl && previewUrl.startsWith('blob:')) {
                try {
                  URL.revokeObjectURL(previewUrl);
                } catch (e) {}
              }
              
              setPreviewUrl(blobUrl);
              setPreviewReady(true);
              console.log('✅ Preview loaded from API', { htmlLength: htmlContent.length });
              return;
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ API request timed out, using fallback content');
      } else {
        console.error('Error fetching site data:', error);
      }
    }
    
    // Fallback to generating content based on chat messages (only if no content available)
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
    
    let dynamicContent = '';
    let backgroundColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    let textColor = 'white';
    let mainText = site.name;
    
    // If we have no content at all, show a simple loading message instead of waiting
    if (!lastUserMessage && !currentWebsiteContent) {
      console.warn('⚠️ No content available for preview, showing placeholder');
      dynamicContent = `
        <div class="main-content">
          <h1>${site.name}</h1>
          <p>Website is being generated...</p>
          <p style="margin-top: 2rem; opacity: 0.7;">Please wait while your website is created.</p>
        </div>
      `;
    } else {
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
          dynamicContent = generateEcommerceContent(userRequest, textColor);
        } else if (websiteType === 'blog') {
          dynamicContent = generateBlogContent(userRequest, textColor);
        } else if (websiteType === 'restaurant') {
          dynamicContent = generateAdvancedRestaurantContent(userRequest, textColor, extractedData);
        } else if (websiteType === 'news') {
          dynamicContent = generateNewsContent(userRequest, textColor, extractedData);
        } else if (websiteType === 'landing') {
          dynamicContent = generateBusinessContent(userRequest, textColor, extractedData);
        } else if (websiteType === 'creative') {
          dynamicContent = generateCreativeContent(userRequest, textColor, extractedData);
        } else {
          // Universal fallback - handle ANY prompt intelligently
          dynamicContent = generateBusinessContent(userRequest, textColor, extractedData);
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
      
      // Fix broken image URLs before creating blob
      htmlContent = fixImageUrls(htmlContent);
      // Inject navigation script for in-preview link clicking
      htmlContent = injectNavigationScript(htmlContent);
      
      // Use Blob URL instead of data URL for Safari compatibility
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Clean up old blob URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {
          // Ignore errors when revoking old URLs
        }
      }
      
      setPreviewUrl(blobUrl);
      setPreviewReady(true);
      
      // Debug logging
      console.log('✅ Preview URL set (blob):', blobUrl.substring(0, 50) + '...');
      console.log('Content type detected:', websiteType);
      console.log('Main text:', mainText);
    }
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
      return generateEcommerceContent(lastUserMessage.content, '#ffffff');
    } else if (analysis.type === 'blog') {
      return generateBlogContent(lastUserMessage.content, '#ffffff');
    } else if (analysis.type === 'landing') {
      return generateBusinessContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'news') {
      return generateNewsContent(lastUserMessage.content, '#ffffff', analysis);
    } else if (analysis.type === 'creative') {
      return generateCreativeContent(lastUserMessage.content, '#ffffff', analysis);
    } else {
      return generateBusinessContent(lastUserMessage.content, '#ffffff', analysis);
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

    // Ensure all existing messages have proper Date timestamps before adding new one
    const normalizedMessages = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date 
        ? msg.timestamp 
        : typeof msg.timestamp === 'string' 
          ? new Date(msg.timestamp) 
          : new Date()
    }));
    
    const newMessages = [...normalizedMessages, userMessage];
    setMessages(newMessages);
    const inputValue = input; // Save input value before clearing
    setInput('');
    setIsLoading(true);

    // ============= PROGRESS SIMULATION =============
    // Detect if this is a clone request for more detailed progress
    const isCloneRequest = /copy|clone|replicate|recreate|make it like|make it look like|same as|similar to/i.test(inputValue);
    const isMultiPage = /multi-?page|multiple pages|full website|complete website/i.test(inputValue);
    
    // Progress steps based on request type
    const cloneSteps = [
      { step: '🔍 Analyzing request', detail: 'Understanding what you want to build...', percent: 5 },
      { step: '🌐 Fetching target website', detail: 'Downloading HTML and CSS...', percent: 15 },
      { step: '🎨 Extracting color palette', detail: 'Identifying all colors used...', percent: 25 },
      { step: '🔤 Analyzing typography', detail: 'Detecting fonts and text styles...', percent: 35 },
      { step: '📐 Mapping layout structure', detail: 'Understanding grid and sections...', percent: 45 },
      { step: '🖼️ Cataloging images', detail: 'Finding all images and their contexts...', percent: 55 },
      { step: '📝 Building HTML structure', detail: 'Creating the page skeleton...', percent: 65 },
      { step: '🖌️ Applying styles', detail: 'Matching the visual design...', percent: 75 },
      { step: '✨ Adding animations', detail: 'Implementing hover effects and transitions...', percent: 85 },
      { step: '🔧 Final polish', detail: 'Optimizing for responsiveness...', percent: 95 },
    ];
    
    const generateSteps = [
      { step: '🔍 Analyzing your request', detail: 'Understanding what you want...', percent: 10 },
      { step: '🎨 Designing layout', detail: 'Planning sections and structure...', percent: 25 },
      { step: '📝 Generating HTML', detail: 'Building the page structure...', percent: 40 },
      { step: '🖌️ Applying styles', detail: 'Adding colors, fonts, and spacing...', percent: 55 },
      { step: '🖼️ Adding images', detail: 'Selecting relevant imagery...', percent: 70 },
      { step: '✨ Adding interactions', detail: 'Implementing hover effects...', percent: 85 },
      { step: '🔧 Finalizing', detail: 'Polishing the final result...', percent: 95 },
    ];
    
    const multiPageSteps = [
      { step: '🔍 Analyzing request', detail: 'Planning multi-page structure...', percent: 5 },
      { step: '🎨 Creating design system', detail: 'Defining colors, fonts, components...', percent: 15 },
      { step: '📄 Generating index.html', detail: 'Building the homepage...', percent: 30 },
      { step: '📄 Generating about.html', detail: 'Creating the about page...', percent: 45 },
      { step: '📄 Generating services.html', detail: 'Building the services page...', percent: 60 },
      { step: '📄 Generating contact.html', detail: 'Creating the contact page...', percent: 75 },
      { step: '🔗 Linking pages', detail: 'Ensuring navigation works...', percent: 85 },
      { step: '✨ Final polish', detail: 'Adding animations and effects...', percent: 95 },
    ];
    
    const modifySteps = [
      { step: '🔍 Understanding changes', detail: 'Analyzing your modification request...', percent: 20 },
      { step: '📝 Updating code', detail: 'Making the requested changes...', percent: 50 },
      { step: '✨ Applying changes', detail: 'Integrating updates...', percent: 80 },
      { step: '🔧 Verifying', detail: 'Ensuring everything works...', percent: 95 },
    ];
    
    // Select appropriate steps
    const hasWebsiteContent = currentWebsiteContent && typeof currentWebsiteContent === 'object' && Object.keys(currentWebsiteContent).length > 0;
    const isNewSiteForProgress = site.status === 'generating' || !hasWebsiteContent;
    
    let progressSteps = modifySteps;
    if (isNewSiteForProgress) {
      if (isCloneRequest) {
        progressSteps = cloneSteps;
      } else if (isMultiPage) {
        progressSteps = multiPageSteps;
      } else {
        progressSteps = generateSteps;
      }
    }
    
    // Start progress simulation
    let stepIndex = 0;
    setGenerationProgress(progressSteps[0]);
    
    // Calculate timing based on expected operation length
    const totalTime = isCloneRequest ? 180000 : (isMultiPage ? 150000 : 60000); // 3min for clone, 2.5min for multi-page, 1min for normal
    const stepTime = totalTime / progressSteps.length;
    
    progressIntervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < progressSteps.length) {
        setGenerationProgress(progressSteps[stepIndex]);
      }
    }, stepTime);

    try {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
      
      // For new sites (status: 'generating' or no websiteContent), generate website
      // For existing sites, modify website
      // CRITICAL: Check both site status AND currentWebsiteContent state
      const hasWebsiteContent = currentWebsiteContent && typeof currentWebsiteContent === 'object' && Object.keys(currentWebsiteContent).length > 0;
      const isNewSite = site.status === 'generating' || !hasWebsiteContent;
      
      console.log('🔍 Site check:', {
        status: site.status,
        hasWebsiteContent,
        isNewSite,
        currentWebsiteContentKeys: currentWebsiteContent ? Object.keys(currentWebsiteContent) : []
      });
      
      // Ensure site.id exists before making API calls
      if (!site.id) {
        throw new Error('Site ID is missing. Please refresh and try again.');
      }
      
      // Generate name from prompt if it's a new site
      const generateNameFromPrompt = (prompt: string): string => {
        const lowerPrompt = prompt.toLowerCase();
        
        // Extract business type or main subject
        if (lowerPrompt.includes('car') && (lowerPrompt.includes('detail') || lowerPrompt.includes('wash') || lowerPrompt.includes('auto'))) {
          return 'Auto Detailing Website';
        } else if (lowerPrompt.includes('snow') || lowerPrompt.includes('snowplow') || lowerPrompt.includes('plow')) {
          return 'Snow Removal Services';
        } else if (lowerPrompt.includes('restaurant') || lowerPrompt.includes('food') || lowerPrompt.includes('dining')) {
          return 'Restaurant Website';
        } else if (lowerPrompt.includes('landscap') || lowerPrompt.includes('lawn') || lowerPrompt.includes('garden')) {
          return 'Landscaping Services';
        } else if (lowerPrompt.includes('construction') || lowerPrompt.includes('contractor') || lowerPrompt.includes('building')) {
          return 'Construction Company';
        } else if (lowerPrompt.includes('portfolio')) {
          return 'Portfolio Website';
        } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('store') || lowerPrompt.includes('shop')) {
          return 'E-commerce Store';
        } else if (lowerPrompt.includes('blog')) {
          return 'Blog Website';
        } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
          return 'SaaS Product';
        } else {
          // Try to extract a meaningful name from the prompt
          const words = prompt.split(/\s+/).filter(w => w.length > 3);
          if (words.length > 0) {
            // Capitalize first letter of first few words
            const nameWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            return nameWords.join(' ') + ' Website';
          }
          return `Website ${Date.now()}`;
        }
      };
      
      // Use proven Gemini endpoint for reliable HTML generation
      const endpoint = isNewSite ? '/api/sites/generate' : '/api/sites/modify';
      
      const requestBody = isNewSite 
        ? {
            name: generateNameFromPrompt(input.trim()),
            description: input.trim(),
            mode: 'full' as const,
          }
        : {
            siteId: site.id,
            message: input.trim(),
            chatHistory: newMessages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : typeof msg.timestamp === 'string' ? msg.timestamp : new Date().toISOString()
            })),
            currentCode: currentWebsiteContent || {} // Pass current website content for modification (empty object if none)
          };
      
      // Validate request body
      if (isNewSite && (!requestBody.description || requestBody.description.length < 3)) {
        throw new Error('Please provide a website description (at least 3 characters)');
      }
      
      const response = await fetchWithAuth(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        // Handle insufficient credits error (402 Payment Required)
        if (response.status === 402 && errorData.credits) {
          const creditError = new Error(errorData.message || `Insufficient credits. You need ${errorData.credits.required} credits but only have ${errorData.credits.current}.`);
          (creditError as any).isCreditError = true;
          (creditError as any).credits = errorData.credits;
          throw creditError;
        }
        
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        const errorDetails = errorData.details ? ` Details: ${errorData.details}` : '';
        console.error('API Error:', errorData);
        throw new Error(errorMessage + errorDetails);
      }
      
        const result = await response.json();
        
        // Handle API response - get websiteContent from various response formats
        const websiteContent = result.websiteContent || result.result?.websiteContent || result.fileMap;
        
        console.log('📦 API Response received:', {
          success: result.success,
          hasWebsiteContent: !!websiteContent,
          websiteContentKeys: websiteContent ? Object.keys(websiteContent) : [],
          hasResult: !!result.result
        });
        
        // Check if generation actually failed (success: false)
        if (result.success === false) {
          throw new Error(result.message || result.error || 'Website generation failed');
        }
        
        // Handle both generate and modify responses
        if (result.success || result.result) {
          // Use chat history from result if provided (modify endpoint returns it)
          // Otherwise build it from existing messages + new assistant message
          let finalMessages: ChatMessage[];
          
          if (result.chatHistory && Array.isArray(result.chatHistory)) {
            // Backend returned complete chat history - use it directly
            finalMessages = result.chatHistory.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? (typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp) : new Date()
            }));
            console.log('✅ Using chat history from backend:', finalMessages.length, 'messages');
          } else {
            // Build chat history from existing messages + new assistant message
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: result.message || (isNewSite ? '✅ I\'ve generated your website using the new spec-first architecture! The preview should appear shortly.' : 'I\'ve updated your website! The changes should be visible in the preview.'),
              timestamp: new Date()
            };
            
            finalMessages = [...newMessages, assistantMessage].map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date 
                ? msg.timestamp 
                : typeof msg.timestamp === 'string' 
                  ? new Date(msg.timestamp) 
                  : new Date()
            }));
          }
          
          setMessages(finalMessages);
          const updatedSite = result.result || result;
          
          console.log('🔍 Extracted websiteContent:', {
            hasWebsiteContent: !!websiteContent,
            isObject: typeof websiteContent === 'object',
            keys: websiteContent ? Object.keys(websiteContent) : [],
            hasIndexHtml: websiteContent && !!websiteContent['index.html'],
            indexHtmlLength: websiteContent && websiteContent['index.html'] ? websiteContent['index.html'].length : 0
          });
          
          // CRITICAL: Update current website content state for future modifications
          if (websiteContent && typeof websiteContent === 'object' && Object.keys(websiteContent).length > 0) {
            setCurrentWebsiteContent(websiteContent);
            console.log('✅ Website content updated:', Object.keys(websiteContent).length, 'files', { keys: Object.keys(websiteContent) });
          } else {
            console.error('❌ No websiteContent found in response:', { result });
          }
          
          // Save chat history and website content to database (backend should have already saved, but ensure sync)
          try {
            const saveResponse = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                chatHistory: finalMessages.map(msg => ({
                  ...msg,
                  timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : typeof msg.timestamp === 'string' ? msg.timestamp : new Date().toISOString()
                })),
                websiteContent: websiteContent || currentWebsiteContent,
                status: isNewSite ? 'deployed' : site.status,
                previewUrl: result.previewUrl || updatedSite?.previewUrl || site.previewUrl,
              }),
            });
            
            if (!saveResponse.ok) {
              const errorData = await saveResponse.json().catch(() => ({}));
              console.error('⚠️ Failed to save chat history:', errorData);
            } else {
              console.log('✅ Chat history and website content saved successfully', { 
                messageCount: finalMessages.length,
                filesCount: websiteContent ? Object.keys(websiteContent).length : 0
              });
            }
          } catch (saveError) {
            console.error('⚠️ Error saving chat history:', saveError);
          }
        
        // CRITICAL: Update preview with new website content immediately
        if (websiteContent && typeof websiteContent === 'object' && Object.keys(websiteContent).length > 0) {
          console.log('🎨 Updating preview with websiteContent...');
          
          // Try multiple possible keys for HTML content
          const htmlContent = websiteContent['index.html'] || 
                             websiteContent['Index.html'] ||
                             websiteContent['INDEX.HTML'] ||
                             Object.values(websiteContent).find((content: any) => 
                               typeof content === 'string' && 
                               (content.includes('<!DOCTYPE') || content.includes('<html') || content.includes('<body'))
                             ) as string | undefined;
          
          if (htmlContent) {
            console.log('✅ Found HTML content, processing...', { 
              key: websiteContent['index.html'] ? 'index.html' : 'other',
              length: htmlContent.length 
            });
            
            let processedHtml = htmlContent.trim();
            
            // Clean up any markdown markers that might have slipped through
            if (processedHtml.startsWith('```')) {
              processedHtml = processedHtml.replace(/^```[a-z]*\s*\n?/i, '');
            }
            if (processedHtml.endsWith('```')) {
              processedHtml = processedHtml.replace(/\n?```$/i, '');
            }
            processedHtml = processedHtml.trim();
            
            // Ensure it's valid HTML
            if (processedHtml.includes('<!DOCTYPE') || processedHtml.includes('<html') || processedHtml.includes('<body')) {
              // Fix broken image URLs before creating blob
              processedHtml = fixImageUrls(processedHtml);
              
              // Validate HTML has actual content (not just empty tags)
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = processedHtml;
              const hasContent = tempDiv.textContent && tempDiv.textContent.trim().length > 0;
              
              if (!hasContent && processedHtml.length < 500) {
                console.error('❌ HTML appears to be empty or invalid:', processedHtml.substring(0, 500));
                throw new Error('Generated HTML appears to be empty. Please try again.');
              }
              
              // Inject navigation script for in-preview link clicking
              processedHtml = injectNavigationScript(processedHtml);
              
              // Use Blob URL instead of data URL for Safari compatibility
              const blob = new Blob([processedHtml], { type: 'text/html;charset=utf-8' });
              const blobUrl = URL.createObjectURL(blob);
              
              // Clean up old blob URL if it exists
              if (previewUrl && previewUrl.startsWith('blob:')) {
                try {
                  URL.revokeObjectURL(previewUrl);
                } catch (e) {
                  // Ignore errors when revoking old URLs
                }
              }
              
              // Force iframe reload by updating key
              const newKey = previewKey + 1;
              setPreviewKey(newKey);
              setPreviewUrl(blobUrl);
              setPreviewReady(true); // Set ready immediately - blob URLs work instantly
              setIsPreviewLoading(false);
              
              console.log('✅ Preview updated with new AI-generated content (instant)', { 
                htmlLength: processedHtml.length,
                blobUrl: blobUrl.substring(0, 50) + '...',
                previewKey: newKey,
                hasContent
              });
            } else {
              console.error('❌ Invalid HTML content:', processedHtml.substring(0, 200));
              // Fallback: regenerate preview from messages
              checkPreviewReady();
            }
          } else {
            console.error('❌ No HTML content found in websiteContent:', { 
              keys: Object.keys(websiteContent),
              values: Object.keys(websiteContent).map(k => typeof websiteContent[k])
            });
            // Fallback: regenerate preview from messages
            checkPreviewReady();
          }
        } else {
          console.error('❌ No websiteContent to update preview with:', { 
            hasWebsiteContent: !!websiteContent,
            isObject: websiteContent && typeof websiteContent === 'object',
            keys: websiteContent && typeof websiteContent === 'object' ? Object.keys(websiteContent) : []
          });
          
          // Fallback: try preview URL if provided
          if (result.previewUrl || updatedSite?.previewUrl) {
            console.log('🔄 Using preview URL fallback:', result.previewUrl || updatedSite?.previewUrl);
            setPreviewUrl(result.previewUrl || updatedSite.previewUrl);
            checkPreviewReady(); // Check immediately, no delay
          } else {
            console.log('⚠️ No preview URL available, checking preview ready...');
            checkPreviewReady();
          }
        }

        // Update site status if it was a new site
        if (isNewSite && updatedSite) {
          onUpdate({ ...site, ...updatedSite, status: 'deployed' });
        }

        // Update credits if provided in response
        if (result.credits?.remaining !== undefined && (window as any).onCreditsUpdate) {
          (window as any).onCreditsUpdate(result.credits.remaining);
        }

        toast({
          title: isNewSite ? "Website Generated" : "Website Updated",
          description: isNewSite 
            ? `Your website has been generated successfully with Kirin! ${result.credits ? `(${result.credits.remaining} credits remaining)` : ''}` 
            : `Your changes have been applied successfully! ${result.credits ? `(${result.credits.remaining} credits remaining)` : ''}`,
        });
      } else {
        throw new Error(result.error || (isNewSite ? 'Failed to generate website' : 'Failed to update website'));
      }
    } catch (error: any) {
      console.error('Error updating website:', error);
      
      // Add user message back if request failed
      setInput(inputValue);
      
      // Handle credit errors specially
      if (error.isCreditError && error.credits) {
        toast({
          title: "Insufficient Credits",
          description: error.message || `You need ${error.credits.required} credits but only have ${error.credits.current}. Please upgrade your plan to get more credits.`,
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Trigger upgrade modal if available
                if ((window as any).openPricingModal) {
                  (window as any).openPricingModal();
                } else {
                  window.location.href = '/dashboard?upgrade=true';
                }
              }}
            >
              Upgrade Plan
            </Button>
          ),
        });
      } else {
        // Show regular error message
        const errorMessage = error.message || "Failed to update website. Please try again.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      // Clear progress simulation
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setGenerationProgress(null);
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

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentModal, setDeploymentModal] = useState<{ show: boolean; url?: string; repoUrl?: string }>({ show: false });

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetchWithAuth('/api/sites/deploy/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to deploy';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.details || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        onUpdate({ ...site, previewUrl: result.previewUrl, repoUrl: result.repoUrl, status: 'live' });
        setPreviewUrl(result.previewUrl);
        setDeploymentModal({ 
          show: true, 
          url: result.previewUrl,
          repoUrl: result.repoUrl 
        });
        toast({
          title: "Deployment Successful!",
          description: "Your website is now live on Vercel.",
        });
      } else {
        throw new Error(result.error || 'Failed to deploy');
      }
    } catch (error: any) {
      console.error('Error deploying:', error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
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
                variant="default"
                size="sm"
                onClick={handleDeploy}
                disabled={isDeploying || !!(site.previewUrl?.includes('vercel') && site.repoUrl)}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    {site.previewUrl?.includes('vercel') && site.repoUrl ? 'Deployed' : 'Deploy'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            // Ensure timestamp is a Date object
            const timestamp = message.timestamp instanceof Date 
              ? message.timestamp 
              : typeof message.timestamp === 'string' 
                ? new Date(message.timestamp) 
                : new Date();
            
            return (
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
                    {timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4 max-w-md">
                {generationProgress ? (
                  <div className="space-y-3">
                    {/* Progress Header */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{generationProgress.step}</div>
                        <div className="text-xs text-muted-foreground">{generationProgress.detail}</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-indigo-500 font-medium">{generationProgress.percent}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${generationProgress.percent}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Animated Dots */}
                    <div className="flex items-center justify-center gap-1 pt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
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
              <h3 className="text-lg font-semibold">Preview</h3>
              {site.previewUrl?.includes('vercel') && (
                <a 
                  href={site.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full hover:bg-green-500/20 transition-colors"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPreview}
                disabled={isPreviewLoading}
                title="Refresh preview"
              >
                <RefreshCw className={`w-4 h-4 ${isPreviewLoading ? 'animate-spin' : ''}`} />
              </Button>
              {site.previewUrl?.includes('vercel') && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.open(site.previewUrl, '_blank', 'noopener,noreferrer')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Live Site
                </Button>
              )}
            </div>
          </div>
          
          {/* Multi-Page Tabs - Show when there are multiple HTML files */}
          {availablePages.length > 1 && (
            <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-xs text-muted-foreground mr-2 flex-shrink-0">Pages:</span>
              {availablePages.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    // Trigger preview refresh with new page
                    setTimeout(() => refreshPreview(), 100);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex-shrink-0 ${
                    effectiveCurrentPage === page
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {page.replace('.html', '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative">
          {previewUrl ? (
            <iframe
              key={previewKey}
              id="preview-iframe"
              src={previewUrl}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              style={{ backgroundColor: '#ffffff' }}
              onLoad={() => {
                setIsPreviewLoading(false);
                setPreviewReady(true);
                console.log('✅ Preview iframe loaded successfully', { 
                  previewUrl: (previewUrl || '').substring(0, 50) + '...', 
                  previewKey 
                });
              }}
              onError={(e) => {
                console.error('❌ Preview iframe load error:', e);
                setIsPreviewLoading(false);
                setPreviewReady(false);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Preview Available</h3>
                <p className="text-muted-foreground">
                  {currentWebsiteContent && Object.keys(currentWebsiteContent).length > 0
                    ? 'Generating preview from saved content...'
                    : 'The website preview will appear here once it\'s generated.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Success Modal */}
      <Dialog open={deploymentModal.show} onOpenChange={(open) => setDeploymentModal({ ...deploymentModal, show: open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-500" />
              Deployment Successful!
            </DialogTitle>
            <DialogDescription>
              Your website has been deployed to GitHub and Vercel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {deploymentModal.url && (
              <div>
                <label className="text-sm font-medium mb-2 block">Live URL:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={deploymentModal.url}
                    className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(deploymentModal.url || '');
                      toast({ title: "Copied to clipboard!" });
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.open(deploymentModal.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            {deploymentModal.repoUrl && (
              <div>
                <label className="text-sm font-medium mb-2 block">GitHub Repository:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={deploymentModal.repoUrl}
                    className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(deploymentModal.repoUrl, '_blank')}
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setDeploymentModal({ show: false })}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
