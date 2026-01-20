import React, { useState, useRef } from 'react';
import { isHTML, ImportResult, detectInternalPages, DetectedPage } from '@/lib/htmlImporter';

interface ImportedPage {
  filename: string;
  html: string;
  title: string;
  url?: string;
}

interface ImportWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (html: string, pageName?: string) => void;
  onMultiPageImport?: (pages: ImportedPage[]) => void;
  isLight?: boolean;
}

/**
 * Playwright API - Production-grade website scraper
 * Uses Playwright + custom crawler for maximum control and reliability
 * Handles SPAs, JS-heavy sites, auth, and complex layouts
 */
async function playwrightImport(url: string, options?: { crawl?: boolean; maxPages?: number }): Promise<{
  success: boolean;
  html: string;
  title: string;
  description: string;
  metadata: {
    colors: string[];
    fonts: string[];
    images: string[];
    css: { inline: string; external: string[]; parsed: string };
    navigation?: Array<{ text: string; url: string; path: string }>;
  };
  internalPages?: Array<{ url: string; title: string; path: string; suggestedFilename: string }>;
  error?: string;
}> {
  const backendUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://beta-avallon.onrender.com';

  const response = await fetch(`${backendUrl}/api/sites/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, crawl: options?.crawl, maxPages: options?.maxPages }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to import: ${response.status}`);
  }

  return response.json();
}

/**
 * Scrape a specific internal page using Playwright
 */
async function scrapeInternalPage(baseUrl: string, pagePath: string): Promise<{
  success: boolean;
  html: string;
  title: string;
  path: string;
  suggestedFilename: string;
}> {
  const backendUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://beta-avallon.onrender.com';

  const response = await fetch(
    `${backendUrl}/api/sites/import?baseUrl=${encodeURIComponent(baseUrl)}&path=${encodeURIComponent(pagePath)}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to scrape page: ${response.status}`);
  }

  return response.json();
}

export const ImportWebsiteModal: React.FC<ImportWebsiteModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onMultiPageImport,
  isLight = false,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'url' | 'folder'>('url'); // Default to URL tab
  const [pastedContent, setPastedContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [pageName, setPageName] = useState('index.html');
  
  // Update default page name when switching tabs
  const handleTabChange = (tab: 'paste' | 'url' | 'folder') => {
    setActiveTab(tab);
    // Set smart defaults based on tab
    if (tab === 'folder') {
      setPageName('sales-agent.html'); // Better default for folder uploads
    } else if (tab === 'url' || tab === 'paste') {
      // Keep as is or reset to index.html if it's the folder default
      if (pageName === 'sales-agent.html') {
        setPageName('index.html');
      }
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  // Folder upload state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string; type: string }>>([]);
  
  // Multi-page import state
  const [step, setStep] = useState<'input' | 'selectPages'>('input');
  const [detectedPages, setDetectedPages] = useState<DetectedPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [firstPageHtml, setFirstPageHtml] = useState<string>('');
  const [sourceUrl, setSourceUrl] = useState<string>('');

  const [options, setOptions] = useState({
    preserveExternalCSS: true,
    preserveFonts: true,
    preserveImages: true,
    convertRelativeUrls: true,
    inlineExternalCSS: true,
    cleanupHTML: false,
    importMultiplePages: true,
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setPastedContent('');
    setUrlInput('');
    setPageName('index.html');
    setError(null);
    setImportResult(null);
    setStep('input');
    setDetectedPages([]);
    setSelectedPages(new Set());
    setFirstPageHtml('');
    setSourceUrl('');
    onClose();
  };

  const handleBackToInput = () => {
    setStep('input');
    setDetectedPages([]);
    setSelectedPages(new Set());
    setFirstPageHtml('');
    setSourceUrl('');
  };

  const handlePasteImport = async () => {
    if (!pastedContent.trim()) {
      setError('Please paste some code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Processing code...');

    try {
      const content = pastedContent.trim();
      let finalHtml = content;
      
      // Check if it's a full HTML document
      const isFullDocument = content.toLowerCase().includes('<!doctype') || 
                             (content.toLowerCase().includes('<html') && content.toLowerCase().includes('</html>'));
      
      if (!isFullDocument) {
        // Smart wrap: detect what kind of code it is
        const hasStyleTags = /<style[^>]*>[\s\S]*?<\/style>/i.test(content);
        const hasScriptTags = /<script[^>]*>[\s\S]*?<\/script>/i.test(content);
        const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
        
        // Extract style and script tags
        let styles = '';
        let scripts = '';
        let bodyContent = content;
        
        if (hasStyleTags) {
          const styleMatches = content.match(/<style[^>]*>[\s\S]*?<\/style>/gi);
          if (styleMatches) {
            styles = styleMatches.join('\n');
            bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
          }
        }
        
        if (hasScriptTags) {
          const scriptMatches = content.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
          if (scriptMatches) {
            scripts = scriptMatches.join('\n');
            bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
          }
        }
        
        // Generate page title from filename
        const pageTitle = pageName.replace('.html', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
        
        // Wrap in a full HTML document
        finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  ${styles}
</head>
<body>
  ${bodyContent.trim()}
  ${scripts}
</body>
</html>`;
      }

      onImport(finalHtml, pageName);
        handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import code');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  /**
   * URL IMPORT - USES PLAYWRIGHT SCRAPER
   */
  const handleUrlImport = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Normalize URL
    let normalizedUrl = urlInput.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    try {
      new URL(normalizedUrl);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStatus('🎭 Playwright: Starting website import...');

    try {
      setLoadingStatus('🎭 Playwright: Launching headless browser...');
      
      // USE PLAYWRIGHT API
      const data = await playwrightImport(normalizedUrl);
      
      if (!data.success || !data.html) {
        throw new Error(data.error || 'Failed to import website');
      }

      setLoadingStatus('✅ Playwright: Import complete!');

      // Playwright returns FULLY PROCESSED HTML - ready to use!
      const result: ImportResult = {
        html: data.html,
        css: data.metadata?.css?.external || [],
        js: [],
        fonts: data.metadata?.fonts || [],
        images: data.metadata?.images || [],
        frameworks: [],
        errors: [],
        warnings: [],
        inlinedCSS: data.metadata?.css?.parsed || '',
      };

      setImportResult(result);
      
      // Check if we have internal pages from the scraper
      const internalPages = data.internalPages || [];
      const navPages = data.metadata?.navigation || [];
      
      // Combine detected pages from scraper and navigation
      const allPages: DetectedPage[] = [
        ...internalPages.map(p => ({
          url: p.url,
          title: p.title,
          path: p.path,
          suggestedFilename: p.suggestedFilename,
        })),
        ...navPages.filter(n => !internalPages.some(p => p.url === n.url)).map(n => ({
          url: n.url,
          title: n.text,
          path: n.path,
          suggestedFilename: n.path.replace(/^\//, '').replace(/\//g, '-') + '.html' || 'page.html',
        })),
      ];
      
      // Detect internal pages if multi-page import is enabled
      if (options.importMultiplePages && onMultiPageImport && allPages.length > 0) {
        setFirstPageHtml(data.html);
          setSourceUrl(normalizedUrl);
        setDetectedPages(allPages);
        setSelectedPages(new Set(allPages.slice(0, 5).map(p => p.url)));
          setStep('selectPages');
          setIsLoading(false);
          setLoadingStatus('');
          return;
        }

      // Single page import
      console.log('%c✓ Playwright import complete!', 'color: #22c55e; font-weight: bold;');
      onImport(data.html, pageName);
        handleClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import from URL');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };
  
  /**
   * MULTI-PAGE IMPORT - USES PLAYWRIGHT FOR EACH PAGE
   */
  const handleMultiPageImport = async () => {
    if (!onMultiPageImport) {
      onImport(firstPageHtml, pageName);
      handleClose();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const selectedUrls = Array.from(selectedPages);
    const totalPages = selectedUrls.length + 1;
    
    const pages: ImportedPage[] = [{
      filename: pageName,
      html: firstPageHtml,
      title: 'Home',
      url: sourceUrl,
    }];
    
    // Import each selected page using Playwright
    let skippedCount = 0;
    for (let i = 0; i < selectedUrls.length; i++) {
      const pageUrl = selectedUrls[i];
      const page = detectedPages.find(p => p.url === pageUrl);
      
      setLoadingStatus(`🎭 Playwright: Importing page ${i + 2} of ${totalPages}... (${page?.title || 'Unknown'})`);
      
      try {
        // Use the internal page scraper for better SPA support
        const pagePath = page?.path || new URL(pageUrl).pathname;
        const data = await scrapeInternalPage(sourceUrl, pagePath);
        
        if (data.success && data.html && data.html.length > 100) {
          pages.push({
            filename: page?.suggestedFilename || `page-${i + 1}.html`,
            html: data.html,
            title: data.title || page?.title || `Page ${i + 1}`,
            url: pageUrl,
          });
        } else {
          skippedCount++;
          console.warn(`Skipped ${pageUrl}: Invalid or empty content`);
        }
      } catch (err: any) {
        skippedCount++;
        console.warn(`Skipped ${pageUrl}: ${err?.message || 'Page not accessible (404 or SPA route)'}`);
      }
    }
    
    setIsLoading(false);
    setLoadingStatus('');
    
    if (skippedCount > 0) {
      console.log(`%c⚠️ ${skippedCount} pages skipped (404 or JavaScript-only routes)`, 'color: #f59e0b; font-weight: bold;');
    }
    console.log(`%c✓ Playwright import complete! ${pages.length} pages imported.`, 'color: #22c55e; font-weight: bold;');
    
    onMultiPageImport(pages);
    handleClose();
  };
  
  const togglePageSelection = (url: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(url)) {
      newSelected.delete(url);
    } else {
      newSelected.add(url);
    }
    setSelectedPages(newSelected);
  };
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Reading file...');

    try {
      const content = await file.text();

      if (!isHTML(content)) {
        setError('The file does not contain valid HTML.');
        setIsLoading(false);
      return;
    }

      // For file imports, use directly
      onImport(content, file.name);
        handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  // Handle folder/multiple file upload
  const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Reading files...');

    try {
      const fileContents: Array<{ name: string; content: string; type: string }> = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Only process text-based files
        if (file.type.startsWith('text/') || 
            file.name.endsWith('.html') || 
            file.name.endsWith('.htm') ||
            file.name.endsWith('.css') || 
            file.name.endsWith('.js') ||
            file.name.endsWith('.jsx') ||
            file.name.endsWith('.ts') ||
            file.name.endsWith('.tsx') ||
            file.name.endsWith('.json') ||
            file.name.endsWith('.svg') ||
            file.name.endsWith('.md')) {
          const content = await file.text();
          // Get relative path from webkitRelativePath or just the name
          const relativePath = (file as any).webkitRelativePath || file.name;
          fileContents.push({
            name: relativePath,
            content,
            type: file.type || getFileType(file.name),
          });
          setLoadingStatus(`Reading ${i + 1}/${files.length} files...`);
        }
      }

      setUploadedFiles(fileContents);
      setLoadingStatus('');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read files');
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  // Helper to detect file type
  const getFileType = (filename: string): string => {
    if (filename.endsWith('.html') || filename.endsWith('.htm')) return 'text/html';
    if (filename.endsWith('.css')) return 'text/css';
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'text/javascript';
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'text/typescript';
    if (filename.endsWith('.json')) return 'application/json';
    if (filename.endsWith('.svg')) return 'image/svg+xml';
    return 'text/plain';
  };

  // Combine uploaded files into a single page or multiple pages
  const handleFolderImport = () => {
    if (uploadedFiles.length === 0) {
      setError('No files uploaded');
      return;
    }

    // Find all HTML files in the upload
    const htmlFiles = uploadedFiles.filter(f => 
      f.name.endsWith('.html') || f.name.endsWith('.htm')
    );
    
    // Find main HTML file
    let mainHtml = uploadedFiles.find(f => f.name.endsWith('index.html') || f.name.split('/').pop() === 'index.html');
    if (!mainHtml && htmlFiles.length > 0) {
      mainHtml = htmlFiles[0];
    }

    // Collect all CSS and JS
    const cssFiles = uploadedFiles.filter(f => f.name.endsWith('.css'));
    const jsFiles = uploadedFiles.filter(f => 
      f.name.endsWith('.js') || f.name.endsWith('.jsx') || 
      f.name.endsWith('.ts') || f.name.endsWith('.tsx')
    );
    
    // Collect JSON config files (might contain settings)
    const jsonFiles = uploadedFiles.filter(f => f.name.endsWith('.json') && !f.name.includes('package'));
    
    // If multiple HTML files exist, import them all as separate pages
    if (htmlFiles.length > 1) {
      const pages: Array<{ filename: string; html: string; title: string }> = [];
      
      for (const htmlFile of htmlFiles) {
        let html = htmlFile.content;
        const filename = htmlFile.name.split('/').pop() || htmlFile.name;
        
        // Inject shared CSS into each HTML file
        if (cssFiles.length > 0) {
          const cssContent = cssFiles.map(f => 
            `/* === ${f.name} === */\n${f.content}`
          ).join('\n\n');
          
          if (html.includes('</head>')) {
            html = html.replace('</head>', `<style>\n${cssContent}\n</style>\n</head>`);
          } else if (html.includes('<body')) {
            html = html.replace('<body', `<head><style>\n${cssContent}\n</style></head>\n<body`);
          }
        }
        
        // Inject shared JS
        if (jsFiles.length > 0) {
          const jsContent = jsFiles.map(f => 
            `// === ${f.name} ===\n${f.content}`
          ).join('\n\n');
          
          if (html.includes('</body>')) {
            html = html.replace('</body>', `<script>\n${jsContent}\n</script>\n</body>`);
      } else {
            html += `\n<script>\n${jsContent}\n</script>`;
          }
        }
        
        // Extract title
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : filename.replace(/\.html?$/i, '');
        
        pages.push({ filename, html, title });
      }
      
      onMultiPageImport(pages);
        handleClose();
      return;
    }

    let finalHtml = '';

    if (mainHtml) {
      // We have an HTML file - inject CSS and JS into it
      finalHtml = mainHtml.content;
      
      // Inject CSS into <head>
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map(f => 
          `\n/* === ${f.name} === */\n${f.content}`
        ).join('\n');
        
        if (finalHtml.includes('</head>')) {
          finalHtml = finalHtml.replace('</head>', `<style>\n${cssContent}\n</style>\n</head>`);
        } else if (finalHtml.includes('<body')) {
          finalHtml = finalHtml.replace('<body', `<style>\n${cssContent}\n</style>\n<body`);
        }
      }

      // Inject JS before </body>
      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map(f => 
          `\n// === ${f.name} ===\n${f.content}`
        ).join('\n');
        
        if (finalHtml.includes('</body>')) {
          finalHtml = finalHtml.replace('</body>', `<script>\n${jsContent}\n</script>\n</body>`);
        } else {
          finalHtml += `\n<script>\n${jsContent}\n</script>`;
        }
      }
      
      // Inject JSON config as data attributes or global variables
      if (jsonFiles.length > 0) {
        const configScript = jsonFiles.map(f => {
          const varName = f.name.split('/').pop()?.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_') || 'config';
          return `window.${varName} = ${f.content};`;
        }).join('\n');
        
        if (finalHtml.includes('</head>')) {
          finalHtml = finalHtml.replace('</head>', `<script>\n${configScript}\n</script>\n</head>`);
        }
      }
    } else {
      // No HTML file - create one from scratch
      const cssContent = cssFiles.map(f => 
        `/* === ${f.name} === */\n${f.content}`
      ).join('\n\n');
      
      const jsContent = jsFiles.map(f => 
        `// === ${f.name} ===\n${f.content}`
      ).join('\n\n');
      
      const configContent = jsonFiles.map(f => {
        const varName = f.name.split('/').pop()?.replace('.json', '').replace(/[^a-zA-Z0-9]/g, '_') || 'config';
        return `window.${varName} = ${f.content};`;
      }).join('\n');

      // Check if there's a React/component-like structure
      const hasReact = jsFiles.some(f => 
        f.content.includes('import React') || 
        f.content.includes('from "react"') ||
        f.content.includes("from 'react'")
      );
      
      // Check for common widget patterns
      const hasWidget = jsFiles.some(f => 
        f.content.includes('Widget') || 
        f.content.includes('chatbot') ||
        f.content.includes('sales') ||
        f.content.includes('agent')
      );

      if (hasReact) {
        // Create a React-ready HTML template
        finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales Agent</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
${configContent}
  </script>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
${jsContent}

// Auto-render if there's an App component
if (typeof App !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
} else if (typeof Widget !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Widget />);
} else if (typeof SalesAgent !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<SalesAgent />);
}
  </script>
</body>
</html>`;
      } else if (hasWidget) {
        // Create a widget-ready HTML template
        finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales Agent</title>
  <script>
${configContent}
  </script>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="sales-agent-container"></div>
  <div id="chat-widget"></div>
  <div id="app"></div>
  <script>
${jsContent}

// Auto-initialize common widget patterns
document.addEventListener('DOMContentLoaded', function() {
  if (typeof initWidget === 'function') initWidget();
  if (typeof initSalesAgent === 'function') initSalesAgent();
  if (typeof init === 'function') init();
});
  </script>
</body>
</html>`;
      } else {
        // Create a standard HTML template
        finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales Agent</title>
  <script>
${configContent}
  </script>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
${jsContent}
  </script>
</body>
</html>`;
      }
    }

    // Import as a new page
    const fileName = pageName || 'sales-agent.html';
    onImport(finalHtml, fileName);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
        isLight ? 'bg-white' : 'bg-surface-dark'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[28px]">download</span>
              <div>
                <h2 className={`text-xl font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Import Website
                </h2>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Import any website with advanced scraping
                </p>
              </div>
          </div>
          <button 
            onClick={handleClose}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-panel-border text-gray-400'
              }`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">error</span>
                <p className="text-sm text-red-500">{error}</p>
                  </div>
                </div>
          )}

          {step === 'selectPages' ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isLight ? 'bg-blue-50' : 'bg-blue-500/10'}`}>
                <p className={`text-sm font-medium ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                  Found {detectedPages.length} internal pages. Select which ones to import:
                </p>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {detectedPages.map((page) => (
                  <label
                    key={page.url}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPages.has(page.url)
                        ? isLight ? 'bg-primary/10 border border-primary' : 'bg-primary/20 border border-primary'
                        : isLight ? 'bg-slate-50 hover:bg-slate-100 border border-transparent' : 'bg-surface-dark hover:bg-panel-border border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.url)}
                      onChange={() => togglePageSelection(page.url)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isLight ? 'text-slate-700' : 'text-white'}`}>
                        {page.title}
                      </p>
                      <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                        {page.path} → {page.suggestedFilename}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Tabs - URL, Code, and Folder */}
          <div className={`flex gap-1 p-1 rounded-lg mb-6 ${isLight ? 'bg-slate-100' : 'bg-panel-border'}`}>
            {(['url', 'paste', 'folder'] as const).map((tab) => (
                <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                      ? 'bg-primary text-white'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                {tab === 'url' && '🌐 From URL'}
                {tab === 'paste' && '📋 Paste Code'}
                {tab === 'folder' && '📁 Upload Files'}
                </button>
            ))}
              </div>

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Website URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                      : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
                />
              </div>

              {/* Scraper Info */}
              <div className={`p-4 rounded-lg text-sm ${isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">rocket_launch</span>
                  <div>
                    <p className="font-medium mb-1">✨ Advanced Website Scraping</p>
                    <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                      <li>🚀 JavaScript rendering for dynamic content</li>
                      <li>🎨 Complete asset extraction (CSS, images, fonts)</li>
                      <li>📸 Auto-scroll for lazy-loaded content</li>
                      <li>🔗 Smart link rewriting for offline use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Paste Your Code
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste any code: HTML, CSS, JavaScript, or a mix of all three!&#10;&#10;Examples:&#10;• Full HTML document&#10;• HTML snippet (will be wrapped in a page)&#10;• <style>...</style> and <script>...</script> tags"
                  rows={12}
                  className={`w-full px-4 py-3 rounded-lg border text-sm font-mono transition-colors resize-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                      : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
                  }`}
                />
              </div>

              {/* Smart Detection Info */}
              <div className={`p-3 rounded-lg text-sm ${isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/10 text-blue-400'}`}>
                <p className="font-medium">✨ Smart Code Detection</p>
                <p className="text-xs mt-1 opacity-80">
                  Paste HTML, CSS, or JavaScript - we'll automatically wrap it into a proper page.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'folder' && (
            <div className="space-y-4">
              {/* Hidden folder input */}
              <input
                type="file"
                ref={folderInputRef}
                onChange={handleFolderUpload}
                multiple
                // @ts-ignore - webkitdirectory is not standard
                webkitdirectory=""
                className="hidden"
              />
              
              {/* Upload Area */}
              <div
                onClick={() => folderInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-primary ${
                  isLight 
                    ? 'border-slate-300 bg-slate-50 hover:bg-slate-100' 
                    : 'border-panel-border bg-surface-dark hover:bg-panel-border/50'
                }`}
              >
                <span className="material-symbols-outlined text-[48px] text-primary mb-3 block">folder_open</span>
                <p className={`text-lg font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-white'}`}>
                  Click to select a folder
                </p>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                  Upload your sales agent code, widget, or any multi-file project
                </p>
                <p className={`text-xs mt-2 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                  Supports: HTML, CSS, JS, JSX, TS, TSX, JSON, SVG
                </p>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className={`rounded-lg border overflow-hidden ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
                  <div className={`px-4 py-2 text-sm font-medium ${isLight ? 'bg-slate-100 text-slate-700' : 'bg-panel-border text-gray-300'}`}>
                    📁 {uploadedFiles.length} files selected
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-2 text-sm flex items-center gap-2 border-t ${
                          isLight ? 'border-slate-100 text-slate-600' : 'border-panel-border/50 text-gray-400'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {file.name.endsWith('.html') ? 'html' :
                           file.name.endsWith('.css') ? 'css' :
                           file.name.endsWith('.js') || file.name.endsWith('.jsx') ? 'javascript' :
                           file.name.endsWith('.ts') || file.name.endsWith('.tsx') ? 'code' :
                           'description'}
                        </span>
                        <span className="truncate">{file.name}</span>
                        <span className={`ml-auto text-xs ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                          {(file.content.length / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          )}

              {/* Info Box */}
              <div className={`p-4 rounded-lg text-sm ${isLight ? 'bg-purple-50 text-purple-700' : 'bg-purple-500/10 text-purple-400'}`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">smart_toy</span>
                  <div>
                    <p className="font-medium mb-1">🤖 Sales Agent / Widget Upload</p>
                    <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                      <li>Upload your complete code folder</li>
                      <li>Auto-detects HTML, CSS, and JS files</li>
                      <li>Combines everything into a single page</li>
                      <li>Supports React/JSX components</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Name - More prominent for folder uploads */}
          <div className={`mt-6 p-4 rounded-lg ${
            activeTab === 'folder' 
              ? (isLight ? 'bg-amber-50 border border-amber-200' : 'bg-amber-500/10 border border-amber-500/30')
              : ''
          }`}>
            <label className={`block text-sm font-medium mb-2 ${
              activeTab === 'folder' 
                ? (isLight ? 'text-amber-700' : 'text-amber-400')
                : (isLight ? 'text-slate-700' : 'text-gray-300')
            }`}>
              {activeTab === 'folder' ? '⚠️ Save as page (CHANGE THIS!)' : 'Save as page'}
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value.endsWith('.html') ? e.target.value : e.target.value + '.html')}
              placeholder={activeTab === 'folder' ? 'sales-agent.html' : 'index.html'}
              className={`w-full px-4 py-2 rounded-lg border text-sm transition-colors ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                  : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
              }`}
            />
            {activeTab === 'folder' && (
              <p className={`text-xs mt-2 ${isLight ? 'text-amber-600' : 'text-amber-400/80'}`}>
                💡 Change this to avoid overwriting your homepage! Examples: sales-agent.html, chatbot.html, widget.html
              </p>
            )}
          </div>

          {/* Advanced Options */}
          <div className="mt-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 text-sm font-medium ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showAdvanced ? 'expand_less' : 'expand_more'}
              </span>
              Advanced Options
            </button>
            
            {showAdvanced && (
              <div className={`mt-4 p-4 rounded-lg space-y-3 ${isLight ? 'bg-slate-50' : 'bg-surface-dark'}`}>
                {activeTab === 'url' && (
                  <label className="flex items-start gap-3 pt-3 border-t border-panel-border mt-3">
                    <input
                      type="checkbox"
                      checked={options.importMultiplePages}
                      onChange={(e) => setOptions(prev => ({ ...prev, importMultiplePages: e.target.checked }))}
                      className="rounded border-panel-border mt-0.5"
                    />
                    <div>
                      <span className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Import multiple pages</span>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Detect and import internal pages from the website</p>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Import Result Info */}
          {importResult && (
            <div className="mt-4 space-y-3">
              {(importResult.css.length > 0 || importResult.fonts.length > 0 || importResult.images.length > 0) && (
                <div className={`p-4 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-surface-dark/50'}`}>
                  <p className={`text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                    Resources detected:
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {importResult.css.length > 0 && (
                      <div>
                        <p className="text-2xl font-bold text-primary">{importResult.css.length}</p>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>CSS Files</p>
                      </div>
                    )}
                    {importResult.fonts.length > 0 && (
                      <div>
                        <p className="text-2xl font-bold text-primary">{importResult.fonts.length}</p>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Fonts</p>
                      </div>
                    )}
                    {importResult.images.length > 0 && (
                      <div>
                        <p className="text-2xl font-bold text-primary">{importResult.images.length}</p>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Images</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
          {/* Loading Status */}
          {isLoading && loadingStatus && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${isLight ? 'bg-blue-50' : 'bg-blue-500/10'}`}>
              <span className="material-symbols-outlined text-[20px] text-primary animate-spin">progress_activity</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>{loadingStatus}</p>
                <p className={`text-xs ${isLight ? 'text-blue-600/70' : 'text-blue-400/70'}`}>Rendering website with browser automation...</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            {step === 'selectPages' ? (
              <>
                <button
                  onClick={handleBackToInput}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                      : 'bg-panel-border hover:bg-[#323645] text-white'
                  } disabled:opacity-50`}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    onImport(firstPageHtml, pageName);
                    handleClose();
                  }}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight 
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' 
                      : 'bg-panel-border hover:bg-[#323645] text-white'
                  } disabled:opacity-50`}
                >
                  Import Main Page Only
                </button>
                <button
                  onClick={handleMultiPageImport}
                  disabled={isLoading || selectedPages.size === 0}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Cloning...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      Import {selectedPages.size + 1} Pages
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                      : 'bg-panel-border hover:bg-[#323645] text-white'
                  } disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={
                    activeTab === 'paste' ? handlePasteImport : 
                    activeTab === 'folder' ? handleFolderImport : 
                    handleUrlImport
                  }
                  disabled={
                    isLoading || 
                    (activeTab === 'paste' && !pastedContent.trim()) || 
                    (activeTab === 'url' && !urlInput.trim()) ||
                    (activeTab === 'folder' && uploadedFiles.length === 0)
                  }
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      {activeTab === 'folder' ? 'Processing...' : 'Cloning...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        {activeTab === 'folder' ? 'upload_file' : 'rocket_launch'}
                      </span>
                      {activeTab === 'folder' ? 'Import Files' : 'Clone Website'}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportWebsiteModal;
