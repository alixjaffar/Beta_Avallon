import React, { useState, useRef } from 'react';
import { importHTML, quickImport, isHTML, ImportResult, importFromUrl, detectInternalPages, DetectedPage, importMultiplePages } from '@/lib/htmlImporter';

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

export const ImportWebsiteModal: React.FC<ImportWebsiteModalProps> = ({
  isOpen,
  onClose,
  onImport,
  onMultiPageImport,
  isLight = false,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'url' | 'file'>('paste');
  const [pastedContent, setPastedContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [pageName, setPageName] = useState('index.html');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    inlineExternalCSS: true, // New option - inline all CSS
    cleanupHTML: false, // Keep original formatting
    importMultiplePages: true, // Enable multi-page detection
  });

  if (!isOpen) return null;

  const handlePasteImport = async () => {
    if (!pastedContent.trim()) {
      setError('Please paste some HTML content');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Analyzing HTML structure...');

    try {
      // Check if it looks like HTML
      if (!isHTML(pastedContent)) {
        setError('The pasted content does not appear to be valid HTML. Please paste HTML code from your website.');
        setIsLoading(false);
        return;
      }

      setLoadingStatus('Processing HTML and converting URLs...');
      
      // Try to extract source URL from the HTML
      let sourceUrl = '';
      const baseMatch = pastedContent.match(/<base[^>]+href=["']([^"']+)["']/i);
      const canonicalMatch = pastedContent.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      const ogUrlMatch = pastedContent.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i);
      
      sourceUrl = baseMatch?.[1] || canonicalMatch?.[1] || ogUrlMatch?.[1] || '';
      
      setLoadingStatus('Fetching and inlining external CSS...');

      const result = await importHTML(pastedContent, {
        sourceUrl,
        preserveExternalCSS: options.preserveExternalCSS,
        preserveFonts: options.preserveFonts,
        preserveImages: options.preserveImages,
        convertRelativeUrls: options.convertRelativeUrls,
        inlineExternalCSS: options.inlineExternalCSS,
        cleanupHTML: options.cleanupHTML,
        fetchTimeout: 15000,
      });

      setImportResult(result);
      setLoadingStatus('Finalizing import...');

      if (result.errors.length > 0 && result.html.length < 100) {
        setError(result.errors.join(', '));
      } else {
        // Even with some errors, if we have HTML, proceed
        if (result.warnings.length > 0) {
          console.warn('Import warnings:', result.warnings);
        }
        onImport(result.html, pageName);
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import HTML');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL
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
    setLoadingStatus('Fetching website HTML...');

    try {
      const backendUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://beta-avallon.onrender.com';

      const response = await fetch(`${backendUrl}/api/proxy?url=${encodeURIComponent(normalizedUrl)}&type=html`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch website: ${response.status}`);
      }

      const html = await response.text();
      
      setLoadingStatus('Converting relative URLs to absolute...');
      
      // Small delay for UI feedback
      await new Promise(r => setTimeout(r, 100));
      
      setLoadingStatus('Fetching and inlining external CSS stylesheets...');

      const result = await importHTML(html, {
        sourceUrl: normalizedUrl,
        preserveExternalCSS: options.preserveExternalCSS,
        preserveFonts: options.preserveFonts,
        preserveImages: options.preserveImages,
        convertRelativeUrls: options.convertRelativeUrls,
        inlineExternalCSS: options.inlineExternalCSS,
        cleanupHTML: options.cleanupHTML,
        fetchTimeout: 15000,
      });

      setImportResult(result);
      
      // Detect internal pages if multi-page import is enabled
      if (options.importMultiplePages && onMultiPageImport) {
        setLoadingStatus('Detecting internal pages...');
        const pages = detectInternalPages(html, normalizedUrl);
        
        if (pages.length > 0) {
          // Store first page data and show page selection
          setFirstPageHtml(result.html);
          setSourceUrl(normalizedUrl);
          setDetectedPages(pages);
          setSelectedPages(new Set(pages.slice(0, 5).map(p => p.url))); // Select first 5 by default
          setStep('selectPages');
          setIsLoading(false);
          setLoadingStatus('');
          return;
        }
      }

      setLoadingStatus('Finalizing import...');

      if (result.errors.length > 0 && result.html.length < 100) {
        setError(result.errors.join(', '));
      } else {
        // Show what was imported
        const stats = [];
        if (result.css.length > 0) stats.push(`${result.css.length} CSS stylesheets`);
        if (result.fonts.length > 0) stats.push(`${result.fonts.length} fonts`);
        if (result.images.length > 0) stats.push(`${result.images.length} images`);
        if (result.frameworks.length > 0) stats.push(`Frameworks: ${result.frameworks.join(', ')}`);
        
        console.log('%c✓ Import complete!', 'color: #22c55e; font-weight: bold;', stats.join(', '));
        
        // Note about CORS errors - they're expected for many sites
        if (result.warnings.length > 0) {
          console.log('%c→ Note: Some external CSS/JS couldn\'t be fetched due to site security (CORS). ' +
            'CDN resources (Bootstrap, Tailwind, etc.) were preserved and the layout should still render correctly.',
            'color: #f59e0b; font-style: italic;');
        }
        
        onImport(result.html, pageName);
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import from URL');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };
  
  // Handle multi-page import
  const handleMultiPageImport = async () => {
    if (!onMultiPageImport) {
      // Fall back to single page import
      onImport(firstPageHtml, pageName);
      handleClose();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const selectedUrls = Array.from(selectedPages);
    const totalPages = selectedUrls.length + 1; // +1 for the first page we already have
    
    const pages: ImportedPage[] = [{
      filename: pageName,
      html: firstPageHtml,
      title: 'Home',
      url: sourceUrl,
    }];
    
    // Import each selected page
    for (let i = 0; i < selectedUrls.length; i++) {
      const pageUrl = selectedUrls[i];
      const page = detectedPages.find(p => p.url === pageUrl);
      
      setLoadingStatus(`Importing page ${i + 2} of ${totalPages}: ${page?.title || 'Unknown'}...`);
      
      try {
        const result = await importFromUrl(pageUrl);
        
        if (result.html && result.html.length > 100) {
          pages.push({
            filename: page?.suggestedFilename || `page-${i + 1}.html`,
            html: result.html,
            title: page?.title || `Page ${i + 1}`,
            url: pageUrl,
          });
        }
      } catch (err) {
        console.warn(`Failed to import ${pageUrl}:`, err);
      }
    }
    
    setIsLoading(false);
    setLoadingStatus('');
    
    console.log(`%c✓ Multi-page import complete! Imported ${pages.length} pages.`, 'color: #22c55e; font-weight: bold;');
    
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
  
  const selectAllPages = () => {
    setSelectedPages(new Set(detectedPages.map(p => p.url)));
  };
  
  const deselectAllPages = () => {
    setSelectedPages(new Set());
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm') && file.type !== 'text/html') {
      setError('Please select an HTML file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();

      const result = await importHTML(content, {
        preserveExternalCSS: options.preserveExternalCSS,
        preserveFonts: options.preserveFonts,
        preserveImages: options.preserveImages,
        cleanupHTML: options.cleanupHTML,
      });

      setImportResult(result);

      // Use file name as page name
      const fileName = file.name.replace(/\.(html|htm)$/i, '') + '.html';
      setPageName(fileName);

      if (result.errors.length > 0) {
        setError(result.errors.join(', '));
      } else {
        onImport(result.html, fileName);
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className={`rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl ${isLight ? 'bg-white border border-slate-200' : 'bg-[#1a1f2e] border border-panel-border'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">upload_file</span>
            <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Import Website</h2>
          </div>
          <button 
            onClick={handleClose}
            className={`size-8 flex items-center justify-center rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-panel-border text-gray-400 hover:text-white'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Page Selection Step */}
          {step === 'selectPages' ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isLight ? 'bg-green-50' : 'bg-green-500/10'}`}>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
                  <div>
                    <p className={`font-medium ${isLight ? 'text-green-700' : 'text-green-400'}`}>
                      Main page imported successfully!
                    </p>
                    <p className={`text-sm mt-1 ${isLight ? 'text-green-600' : 'text-green-400/80'}`}>
                      We detected {detectedPages.length} additional pages on this website. Select which pages you'd like to import:
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Select/Deselect All */}
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  {selectedPages.size} of {detectedPages.length} pages selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllPages}
                    className={`text-xs px-2 py-1 rounded ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-panel-border hover:bg-[#323645] text-gray-400'}`}
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllPages}
                    className={`text-xs px-2 py-1 rounded ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-panel-border hover:bg-[#323645] text-gray-400'}`}
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              
              {/* Page List */}
              <div className={`rounded-lg border max-h-[300px] overflow-auto ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
                {detectedPages.map((page, index) => (
                  <label
                    key={page.url}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                      index !== detectedPages.length - 1 ? (isLight ? 'border-b border-slate-200' : 'border-b border-panel-border') : ''
                    } ${selectedPages.has(page.url) ? (isLight ? 'bg-primary/5' : 'bg-primary/10') : ''} ${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.url)}
                      onChange={() => togglePageSelection(page.url)}
                      className="rounded border-panel-border text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {page.title}
                      </p>
                      <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                        {page.path} → {page.suggestedFilename}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className={`p-3 rounded-lg text-sm ${isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/10 text-blue-400'}`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                  <p>Each selected page will be imported as a separate HTML file in your website project.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className={`flex gap-1 rounded-lg p-1 mb-6 ${isLight ? 'bg-slate-100' : 'bg-surface-dark'}`}>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'paste'
                      ? 'bg-primary text-white'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">content_paste</span>
                  Paste HTML
                </button>
                <button
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'url'
                      ? 'bg-primary text-white'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">link</span>
                  From URL
                </button>
                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'file'
                      ? 'bg-primary text-white'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">folder_open</span>
                  Upload File
                </button>
              </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Paste your HTML code below
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="<!DOCTYPE html>
<html>
<head>
  <title>Your Website</title>
</head>
<body>
  <!-- Paste your HTML here -->
</body>
</html>"
                  className={`w-full h-64 px-4 py-3 rounded-lg border text-sm font-mono resize-none transition-colors ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                      : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-lg text-sm ${isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/10 text-blue-400'}`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">info</span>
                  <div>
                    <p className="font-medium mb-1">How to copy your website's HTML:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs opacity-80">
                      <li>Open your website in a browser</li>
                      <li>Right-click and select "View Page Source" (or press Ctrl+U / Cmd+Option+U)</li>
                      <li>Select all (Ctrl+A / Cmd+A) and copy (Ctrl+C / Cmd+C)</li>
                      <li>Paste it here!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                />
              </div>

              <div className={`p-4 rounded-lg text-sm ${isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-500/10 text-amber-400'}`}>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
                  <div>
                    <p className="font-medium mb-1">Note:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs opacity-80">
                      <li>Some websites may block external access</li>
                      <li>JavaScript-rendered content may not be captured</li>
                      <li>For best results, use "Paste HTML" with the full source code</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isLight 
                    ? 'border-slate-200 hover:border-primary hover:bg-slate-50' 
                    : 'border-panel-border hover:border-primary hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[48px] mb-4 ${isLight ? 'text-slate-400' : 'text-gray-500'}`}>
                  upload_file
                </span>
                <p className={`text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Click to upload or drag and drop
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                  HTML files only (.html, .htm)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm,text/html"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Page Name */}
          <div className="mt-6">
            <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              Save as page
            </label>
            <input
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value.endsWith('.html') ? e.target.value : e.target.value + '.html')}
              placeholder="index.html"
              className={`w-full px-4 py-2 rounded-lg border text-sm transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                  : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
              }`}
            />
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
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={options.inlineExternalCSS}
                    onChange={(e) => setOptions(prev => ({ ...prev, inlineExternalCSS: e.target.checked }))}
                    className="rounded border-panel-border mt-0.5"
                  />
                  <div>
                    <span className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Fetch and inline external CSS</span>
                    <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Downloads external stylesheets and embeds them (recommended for best results)</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.preserveExternalCSS}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveExternalCSS: e.target.checked }))}
                    className="rounded border-panel-border"
                  />
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Preserve CDN CSS links (Bootstrap, Tailwind, etc.)</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.preserveFonts}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveFonts: e.target.checked }))}
                    className="rounded border-panel-border"
                  />
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Preserve Google Fonts</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.preserveImages}
                    onChange={(e) => setOptions(prev => ({ ...prev, preserveImages: e.target.checked }))}
                    className="rounded border-panel-border"
                  />
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Preserve image references</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.convertRelativeUrls}
                    onChange={(e) => setOptions(prev => ({ ...prev, convertRelativeUrls: e.target.checked }))}
                    className="rounded border-panel-border"
                  />
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Convert relative URLs to absolute</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={options.cleanupHTML}
                    onChange={(e) => setOptions(prev => ({ ...prev, cleanupHTML: e.target.checked }))}
                    className="rounded border-panel-border"
                  />
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>Clean up and format HTML (may alter original)</span>
                </label>
                
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
              {/* Frameworks detected */}
              {importResult.frameworks.length > 0 && (
                <div className={`p-4 rounded-lg ${isLight ? 'bg-green-50' : 'bg-green-500/10'}`}>
                  <p className={`text-sm font-medium mb-2 ${isLight ? 'text-green-700' : 'text-green-400'}`}>
                    Detected frameworks:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {importResult.frameworks.map((fw) => (
                      <span 
                        key={fw} 
                        className={`px-2 py-1 rounded text-xs font-medium ${isLight ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'}`}
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Import stats */}
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
              
              {/* Warnings */}
              {importResult.warnings.length > 0 && (
                <div className={`p-4 rounded-lg ${isLight ? 'bg-amber-50' : 'bg-amber-500/10'}`}>
                  <p className={`text-sm font-medium mb-2 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                    Import notes:
                  </p>
                  <ul className="space-y-1">
                    {importResult.warnings.slice(0, 3).map((warning, i) => (
                      <li key={i} className={`text-xs ${isLight ? 'text-amber-600' : 'text-amber-400/80'}`}>
                        • {warning}
                      </li>
                    ))}
                    {importResult.warnings.length > 3 && (
                      <li className={`text-xs ${isLight ? 'text-amber-600' : 'text-amber-400/80'}`}>
                        • And {importResult.warnings.length - 3} more...
                      </li>
                    )}
                  </ul>
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
                <p className={`text-xs ${isLight ? 'text-blue-600/70' : 'text-blue-400/70'}`}>This may take a moment for large websites...</p>
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
                    // Import just the first page
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
                      Importing...
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
                  onClick={activeTab === 'paste' ? handlePasteImport : handleUrlImport}
                  disabled={isLoading || (activeTab === 'paste' && !pastedContent.trim()) || (activeTab === 'url' && !urlInput.trim())}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Importing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      Import Website
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
