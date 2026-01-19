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
  const [activeTab, setActiveTab] = useState<'paste' | 'url' | 'file'>('url'); // Default to URL tab
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
      setError('Please paste some HTML content');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStatus('Analyzing HTML...');

    try {
      if (!isHTML(pastedContent)) {
        setError('The pasted content does not appear to be valid HTML.');
        setIsLoading(false);
        return;
      }

      // For pasted HTML, just use it directly (already processed by user)
      onImport(pastedContent, pageName);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import HTML');
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
          {/* Tabs */}
          <div className={`flex gap-1 p-1 rounded-lg mb-6 ${isLight ? 'bg-slate-100' : 'bg-panel-border'}`}>
            {(['url', 'paste', 'file'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'url' && '🌐 From URL'}
                {tab === 'paste' && '📋 Paste HTML'}
                {tab === 'file' && '📁 Upload File'}
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
                  Paste HTML Code
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>...</head>&#10;  <body>...</body>&#10;</html>"
                  rows={10}
                  className={`w-full px-4 py-3 rounded-lg border text-sm font-mono transition-colors resize-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary' 
                      : 'bg-surface-dark border-panel-border text-white placeholder-gray-500 focus:border-primary'
                  }`}
                />
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
                  onClick={activeTab === 'paste' ? handlePasteImport : handleUrlImport}
                  disabled={isLoading || (activeTab === 'paste' && !pastedContent.trim()) || (activeTab === 'url' && !urlInput.trim())}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Cloning...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                      Clone Website
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
