import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggleButton } from './ThemeToggleButton';
import { ImportWebsiteModal } from './ImportWebsiteModal';
import { quickImport, isHTML } from '@/lib/htmlImporter';

interface WebsiteEditorProps {
  site: {
    id: string;
    name: string;
    slug: string;
    status: string;
    previewUrl?: string;
    repoUrl?: string;
    websiteContent?: Record<string, string>;
    initialPrompt?: string;
  };
  onUpdate: (site: any) => void;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  changes?: string[];
}

interface SelectedElement {
  tagName: string;
  id: string;
  className: string;
  path: string[];
  styles: {
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    borderRadius: string;
    textAlign: string;
    lineHeight: string;
    letterSpacing: string;
    width: string;
    height: string;
    display: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    gap: string;
  };
  content: string;
  rect: { x: number; y: number; width: number; height: number };
  xpath: string;
  href?: string; // For links and buttons
  isClickable?: boolean; // True if element is a link or button
}

// Fallback images for broken URLs
const FALLBACK_IMAGE_IDS = [
  '1522071820080-37f2cb85c41d',
  '1497366216548-37526070297c',
  '1556761175-4bda37b9dd37',
  '1556761175-b4136fa58510',
  '1552664736-d46ed1db83d9',
];

function fixImageUrls(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Fix broken Unsplash URLs with "photo-" prefix
  const brokenSrcPattern = /src=["'](photo-\d+-[a-zA-Z0-9]+[^"']*)["']/gi;
  html = html.replace(brokenSrcPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `src="https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop"`;
  });
  
  // Fix numeric-only Unsplash IDs like "1497366216548-37526070297c"
  const numericSrcPattern = /src=["'](\d{10,}-[a-zA-Z0-9]+)["']/gi;
  html = html.replace(numericSrcPattern, (match, photoId) => {
    return `src="https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop"`;
  });
  
  // Fix CSS url() patterns with photo- prefix
  const brokenUrlPattern = /url\(["']?(photo-\d+-[a-zA-Z0-9]+[^"')]*)["']?\)/gi;
  html = html.replace(brokenUrlPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `url("https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix CSS url() patterns with numeric IDs
  const numericUrlPattern = /url\(["']?(\d{10,}-[a-zA-Z0-9]+)["']?\)/gi;
  html = html.replace(numericUrlPattern, (match, photoId) => {
    return `url("https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix any remaining src that doesn't start with http/https/data/./
  const brokenImagePattern = /src=["'](?!https?:\/\/|data:|\.\/|\/|#)([^"']+)["']/g;
  html = html.replace(brokenImagePattern, (match, brokenUrl) => {
    // If it looks like a photo ID (photo-XXX or numeric-XXX), use Unsplash
    if (brokenUrl.match(/^photo-\d+-[a-zA-Z0-9]+/)) {
      const cleanPhotoId = brokenUrl.split('?')[0].split('&')[0];
      return `src="https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop"`;
    }
    // If it looks like a numeric Unsplash ID
    if (brokenUrl.match(/^\d{10,}-[a-zA-Z0-9]+/)) {
      return `src="https://images.unsplash.com/photo-${brokenUrl}?w=800&h=600&fit=crop"`;
    }
    // Otherwise use a placeholder service
    return `src="https://picsum.photos/800/600"`;
  });
  
  if (html.includes('</body>') || html.includes('</html>')) {
    const imageErrorHandler = `
<script>
(function() {
  const fallbackImages = ${JSON.stringify(FALLBACK_IMAGE_IDS)};
  let fallbackIndex = 0;
  function getFallbackImageUrl() {
    if (fallbackIndex >= fallbackImages.length) fallbackIndex = 0;
    return 'https://images.unsplash.com/photo-' + fallbackImages[fallbackIndex++] + '?w=800&h=600&fit=crop';
  }
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.src = getFallbackImageUrl();
    };
  });
})();
</script>`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', imageErrorHandler + '</body>');
    } else if (html.includes('</html>')) {
      html = html.replace('</html>', imageErrorHandler + '</html>');
    }
  }
  
  return html;
}

// Inject navigation script for multi-page support
function injectNavigationScript(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  const navScript = `
<script>
(function() {
  document.querySelectorAll('a[href]').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var page = href;
        if (!page.endsWith('.html')) page = page + '.html';
        if (page.startsWith('/')) page = page.substring(1);
        if (page.startsWith('./')) page = page.substring(2);
        window.parent.postMessage({ type: 'navigate', page: page }, '*');
      });
    }
  });
})();
</script>`;

  if (html.includes('</body>')) {
    return html.replace('</body>', navScript + '</body>');
  } else if (html.includes('</html>')) {
    return html.replace('</html>', navScript + '</html>');
  }
  return html + navScript;
}

// Visual editor injection script
function getVisualEditorScript(): string {
  return `
<script>
(function() {
  let selectedElement = null;
  let overlay = null;
  let handles = [];
  let isDragging = false;
  let isResizing = false;
  let dragStart = { x: 0, y: 0 };
  let elementStart = { x: 0, y: 0, width: 0, height: 0 };
  let resizeHandle = null;
  
  // Create selection overlay
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'avallon-selection-overlay';
    overlay.style.cssText = 'position:fixed;pointer-events:none;border:2px solid #6366f1;background:rgba(99,102,241,0.1);z-index:99999;transition:all 0.15s ease;display:none;';
    document.body.appendChild(overlay);
    
    // Create resize handles
    const handlePositions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    handlePositions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = 'avallon-handle avallon-handle-' + pos;
      handle.dataset.position = pos;
      handle.style.cssText = 'position:fixed;width:10px;height:10px;background:#6366f1;border:2px solid white;border-radius:2px;z-index:100000;cursor:' + getCursor(pos) + ';display:none;box-shadow:0 2px 4px rgba(0,0,0,0.2);';
      handle.addEventListener('mousedown', startResize);
      document.body.appendChild(handle);
      handles.push(handle);
    });
  }
  
  function getCursor(pos) {
    const cursors = { nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize', se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize' };
    return cursors[pos] || 'pointer';
  }
  
  function updateOverlay(el) {
    if (!overlay || !el) return;
    const rect = el.getBoundingClientRect();
    overlay.style.left = rect.left + 'px';
    overlay.style.top = rect.top + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    overlay.style.display = 'block';
    
    // Update handle positions
    const handleSize = 10;
    const positions = {
      nw: { left: rect.left - handleSize/2, top: rect.top - handleSize/2 },
      n: { left: rect.left + rect.width/2 - handleSize/2, top: rect.top - handleSize/2 },
      ne: { left: rect.right - handleSize/2, top: rect.top - handleSize/2 },
      e: { left: rect.right - handleSize/2, top: rect.top + rect.height/2 - handleSize/2 },
      se: { left: rect.right - handleSize/2, top: rect.bottom - handleSize/2 },
      s: { left: rect.left + rect.width/2 - handleSize/2, top: rect.bottom - handleSize/2 },
      sw: { left: rect.left - handleSize/2, top: rect.bottom - handleSize/2 },
      w: { left: rect.left - handleSize/2, top: rect.top + rect.height/2 - handleSize/2 }
    };
    
    handles.forEach(handle => {
      const pos = handle.dataset.position;
      if (positions[pos]) {
        handle.style.left = positions[pos].left + 'px';
        handle.style.top = positions[pos].top + 'px';
        handle.style.display = 'block';
      }
    });
  }
  
  function hideOverlay() {
    if (overlay) overlay.style.display = 'none';
    handles.forEach(h => h.style.display = 'none');
  }
  
  function getXPath(el) {
    if (!el || el.nodeType !== 1) return '';
    const parts = [];
    while (el && el.nodeType === 1) {
      let index = 1;
      let sibling = el.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === el.tagName) index++;
        sibling = sibling.previousSibling;
      }
      const tagName = el.tagName.toLowerCase();
      parts.unshift(tagName + '[' + index + ']');
      el = el.parentNode;
    }
    return '/' + parts.join('/');
  }
  
  function getElementPath(el) {
    const path = [];
    while (el && el !== document.body && el !== document.documentElement) {
      let name = el.tagName.toLowerCase();
      if (el.id) name += '#' + el.id;
      else if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(' ').filter(c => c && !c.startsWith('avallon-'));
        if (classes.length) name += '.' + classes[0];
      }
      path.unshift(name);
      el = el.parentElement;
    }
    return path;
  }
  
  function getComputedStyles(el) {
    const computed = window.getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontFamily: computed.fontFamily,
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      padding: computed.padding,
      margin: computed.margin,
      borderRadius: computed.borderRadius,
      textAlign: computed.textAlign,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      width: computed.width,
      height: computed.height,
      display: computed.display,
      flexDirection: computed.flexDirection,
      justifyContent: computed.justifyContent,
      alignItems: computed.alignItems,
      gap: computed.gap
    };
  }
  
  function selectElement(el) {
    if (el === document.body || el === document.documentElement) return;
    if (el.id && el.id.startsWith('avallon-')) return;
    if (el.className && typeof el.className === 'string' && el.className.includes('avallon-')) return;
    
    selectedElement = el;
    updateOverlay(el);
    
    const rect = el.getBoundingClientRect();
    const tagName = el.tagName.toLowerCase();
    
    // Get href from links or buttons (check parent too for wrapped elements)
    let href = '';
    let isClickable = false;
    if (tagName === 'a') {
      href = el.getAttribute('href') || '';
      isClickable = true;
    } else if (tagName === 'button') {
      isClickable = true;
      // Check if button has onclick with location
      const onclick = el.getAttribute('onclick') || '';
      if (onclick.includes('location') || onclick.includes('href')) {
        const match = onclick.match(/location[\\s]*=[\\s]*['"]([^'"]+)['"]/);
        if (match) href = match[1];
      }
    } else {
      // Check if parent is a link
      const parentLink = el.closest('a');
      if (parentLink) {
        href = parentLink.getAttribute('href') || '';
        isClickable = true;
      }
    }
    
    const data = {
      tagName: tagName,
      id: el.id || '',
      className: typeof el.className === 'string' ? el.className : '',
      path: getElementPath(el),
      styles: getComputedStyles(el),
      content: el.innerText?.substring(0, 500) || '',
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      xpath: getXPath(el),
      href: href,
      isClickable: isClickable
    };
    
    window.parent.postMessage({ type: 'elementSelected', data: data }, '*');
  }
  
  function startDrag(e) {
    if (!selectedElement || isResizing) return;
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    const rect = selectedElement.getBoundingClientRect();
    elementStart = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    e.preventDefault();
  }
  
  function startResize(e) {
    if (!selectedElement) return;
    isResizing = true;
    resizeHandle = e.target.dataset.position;
    dragStart = { x: e.clientX, y: e.clientY };
    const rect = selectedElement.getBoundingClientRect();
    elementStart = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    e.preventDefault();
    e.stopPropagation();
  }
  
  function handleMouseMove(e) {
    if (isDragging && selectedElement) {
      // For now, just update visual position - actual position change on mouseup
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      // Visual feedback only
    }
    
    if (isResizing && selectedElement && resizeHandle) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      let newWidth = elementStart.width;
      let newHeight = elementStart.height;
      
      if (resizeHandle.includes('e')) newWidth = elementStart.width + dx;
      if (resizeHandle.includes('w')) newWidth = elementStart.width - dx;
      if (resizeHandle.includes('s')) newHeight = elementStart.height + dy;
      if (resizeHandle.includes('n')) newHeight = elementStart.height - dy;
      
      if (newWidth > 20) selectedElement.style.width = newWidth + 'px';
      if (newHeight > 20) selectedElement.style.height = newHeight + 'px';
      
      updateOverlay(selectedElement);
    }
  }
  
  function handleMouseUp(e) {
    if (isResizing && selectedElement) {
      const styles = getComputedStyles(selectedElement);
      window.parent.postMessage({ 
        type: 'elementResized', 
        data: { 
          xpath: getXPath(selectedElement),
          styles: styles
        } 
      }, '*');
    }
    isDragging = false;
    isResizing = false;
    resizeHandle = null;
  }
  
  // Listen for style updates from parent
  window.addEventListener('message', function(e) {
    if (e.data.type === 'updateStyle' && selectedElement) {
      const { property, value } = e.data;
      selectedElement.style[property] = value;
      updateOverlay(selectedElement);
      
      // Send updated styles back
      window.parent.postMessage({
        type: 'styleUpdated',
        data: {
          xpath: getXPath(selectedElement),
          styles: getComputedStyles(selectedElement)
        }
      }, '*');
    }
    
    if (e.data.type === 'updateContent' && selectedElement) {
      selectedElement.innerText = e.data.content;
      window.parent.postMessage({
        type: 'contentUpdated',
        data: {
          xpath: getXPath(selectedElement),
          content: e.data.content
        }
      }, '*');
    }
    
    if (e.data.type === 'deleteElement' && selectedElement) {
      const xpath = getXPath(selectedElement);
      selectedElement.remove();
      selectedElement = null;
      hideOverlay();
      window.parent.postMessage({ type: 'elementDeleted', data: { xpath: xpath } }, '*');
    }
    
    if (e.data.type === 'duplicateElement' && selectedElement) {
      const clone = selectedElement.cloneNode(true);
      selectedElement.parentNode.insertBefore(clone, selectedElement.nextSibling);
      selectElement(clone);
      window.parent.postMessage({ type: 'elementDuplicated', data: { xpath: getXPath(clone) } }, '*');
    }
    
    if (e.data.type === 'deselectElement') {
      selectedElement = null;
      hideOverlay();
    }
    
    if (e.data.type === 'getHTML') {
      // Remove our injected elements before sending HTML
      const overlayEl = document.getElementById('avallon-selection-overlay');
      const handleEls = document.querySelectorAll('.avallon-handle');
      const hoverEl = document.getElementById('avallon-hover-overlay');
      if (overlayEl) overlayEl.remove();
      if (hoverEl) hoverEl.remove();
      handleEls.forEach(h => h.remove());
      
      const html = '<!DOCTYPE html>' + document.documentElement.outerHTML;
      window.parent.postMessage({ type: 'htmlContent', data: { html: html } }, '*');
      
      // Recreate overlay
      createOverlay();
      if (selectedElement) updateOverlay(selectedElement);
    }
    
    // Handle image replacement
    if (e.data.type === 'replaceImage' && selectedElement) {
      const tagName = selectedElement.tagName.toLowerCase();
      const url = e.data.url;
      
      // Handle IMG tags
      if (tagName === 'img') {
        selectedElement.src = url;
        selectedElement.setAttribute('src', url);
        // Also update srcset if it exists
        if (selectedElement.srcset) {
          selectedElement.srcset = url;
        }
      }
      // Handle picture elements
      else if (tagName === 'picture') {
        const img = selectedElement.querySelector('img');
        if (img) {
          img.src = url;
          img.setAttribute('src', url);
        }
        // Update source elements too
        const sources = selectedElement.querySelectorAll('source');
        sources.forEach(source => {
          if (source.srcset) {
            source.srcset = url;
          }
        });
      }
      // Handle elements with background-image (div, section, etc.)
      else {
        const computedStyle = window.getComputedStyle(selectedElement);
        const hasBackgroundImage = computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none';
        
        if (hasBackgroundImage || tagName === 'div' || tagName === 'section' || tagName === 'article' || tagName === 'header' || tagName === 'main') {
          // Set as background image
          selectedElement.style.backgroundImage = 'url("' + url + '")';
          selectedElement.style.backgroundSize = 'cover';
          selectedElement.style.backgroundPosition = 'center';
          selectedElement.style.backgroundRepeat = 'no-repeat';
        } else {
          // Try to find an img child
          const img = selectedElement.querySelector('img');
          if (img) {
            img.src = url;
            img.setAttribute('src', url);
          } else {
            // Last resort: create an img element
            const newImg = document.createElement('img');
            newImg.src = url;
            newImg.style.width = '100%';
            newImg.style.height = '100%';
            newImg.style.objectFit = 'cover';
            selectedElement.innerHTML = '';
            selectedElement.appendChild(newImg);
          }
        }
      }
      
      window.parent.postMessage({
        type: 'imageReplaced',
        data: {
          xpath: getXPath(selectedElement),
          newSrc: url,
          tagName: tagName
        }
      }, '*');
    }
    
    // Handle link/href update
    if (e.data.type === 'updateHref' && selectedElement) {
      const newHref = e.data.href;
      const tagName = selectedElement.tagName.toLowerCase();
      
      if (tagName === 'a') {
        selectedElement.setAttribute('href', newHref);
      } else if (tagName === 'button') {
        // For buttons, wrap in a link or set onclick
        if (newHref.startsWith('http') || newHref.startsWith('/')) {
          selectedElement.setAttribute('onclick', "window.location.href='" + newHref + "'");
        } else if (newHref.startsWith('#')) {
          selectedElement.setAttribute('onclick', "document.querySelector('" + newHref + "')?.scrollIntoView({behavior:'smooth'})");
        }
      } else {
        // Check if parent is a link
        const parentLink = selectedElement.closest('a');
        if (parentLink) {
          parentLink.setAttribute('href', newHref);
        } else {
          // Wrap element in a link
          const link = document.createElement('a');
          link.href = newHref;
          selectedElement.parentNode.insertBefore(link, selectedElement);
          link.appendChild(selectedElement);
        }
      }
      
      window.parent.postMessage({
        type: 'hrefUpdated',
        data: {
          xpath: getXPath(selectedElement),
          newHref: newHref
        }
      }, '*');
    }
  });
  
  // Click handler
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    selectElement(e.target);
  }, true);
  
  // Hover highlight
  let hoverOverlay = null;
  document.addEventListener('mouseover', function(e) {
    if (isDragging || isResizing) return;
    if (e.target === selectedElement) return;
    if (e.target.id && e.target.id.startsWith('avallon-')) return;
    
    if (!hoverOverlay) {
      hoverOverlay = document.createElement('div');
      hoverOverlay.id = 'avallon-hover-overlay';
      hoverOverlay.style.cssText = 'position:fixed;pointer-events:none;border:1px dashed #6366f1;background:rgba(99,102,241,0.05);z-index:99998;transition:all 0.1s ease;';
      document.body.appendChild(hoverOverlay);
    }
    
    const rect = e.target.getBoundingClientRect();
    hoverOverlay.style.left = rect.left + 'px';
    hoverOverlay.style.top = rect.top + 'px';
    hoverOverlay.style.width = rect.width + 'px';
    hoverOverlay.style.height = rect.height + 'px';
    hoverOverlay.style.display = 'block';
  });
  
  document.addEventListener('mouseout', function(e) {
    if (hoverOverlay && !e.relatedTarget) {
      hoverOverlay.style.display = 'none';
    }
  });
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Initialize
  createOverlay();
  
  // Notify parent that visual editor is ready
  window.parent.postMessage({ type: 'visualEditorReady' }, '*');
})();
</script>
<style>
  * { cursor: default !important; }
  a, button { pointer-events: auto !important; }
</style>`;
}

export const WebsiteEditor: React.FC<WebsiteEditorProps> = ({ site, onUpdate, onClose }) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://beta-avallon.onrender.com' : 'http://localhost:3000';
  
  // Determine if we're in light mode
  const isLight = theme === 'light';
  
  // Editor state
  const [mode, setMode] = useState<'ai' | 'visual'>('ai');
  const [input, setInput] = useState(site.initialPrompt || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewReady, setPreviewReady] = useState(false);
  const [currentWebsiteContent, setCurrentWebsiteContent] = useState<Record<string, string>>(site.websiteContent || {});
  const [currentPage, setCurrentPage] = useState<string>('index.html');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Visual editor state
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [propertiesTab, setPropertiesTab] = useState<'style' | 'spacing' | 'content'>('style');
  const [aiAssistInput, setAiAssistInput] = useState('');
  const [isAiAssistLoading, setIsAiAssistLoading] = useState(false);
  
  // Code view state
  const [showCode, setShowCode] = useState(false);
  
  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showImageReplacer, setShowImageReplacer] = useState(false);
  const [imageReplaceUrl, setImageReplaceUrl] = useState('');
  
  // Progress state
  const [generationProgress, setGenerationProgress] = useState<{step: string; detail: string; percent: number} | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get available pages
  const availablePages = Object.keys(currentWebsiteContent).filter(
    key => key.endsWith('.html') && currentWebsiteContent[key]?.includes('<!DOCTYPE')
  ).sort((a, b) => {
    if (a === 'index.html') return -1;
    if (b === 'index.html') return 1;
    return a.localeCompare(b);
  });
  
  const effectiveCurrentPage = availablePages.includes(currentPage) ? currentPage : 'index.html';

  // Suggestion chips
  const suggestions = [
    { icon: 'add', text: 'Add testimonial section' },
    { icon: 'palette', text: 'Make it darker' },
    { icon: 'image', text: 'Change hero image' },
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'navigate' && event.data.page) {
        const page = event.data.page;
        if (currentWebsiteContent[page]) {
          setCurrentPage(page);
        }
      }
      
      if (event.data?.type === 'elementSelected' && mode === 'visual') {
        setSelectedElement(event.data.data);
      }
      
      if (event.data?.type === 'styleUpdated') {
        setHasUnsavedChanges(true);
        // Update selected element with new styles so UI reflects changes
        if (event.data.data?.styles && selectedElement) {
          setSelectedElement(prev => prev ? { ...prev, styles: event.data.data.styles } : null);
        }
      }
      
      if (event.data?.type === 'contentUpdated' || event.data?.type === 'elementResized') {
        setHasUnsavedChanges(true);
        // Update selected element with new styles for resize
        if (event.data.data?.styles && selectedElement) {
          setSelectedElement(prev => prev ? { ...prev, styles: event.data.data.styles } : null);
        }
      }
      
      if (event.data?.type === 'elementDeleted' || event.data?.type === 'elementDuplicated') {
        setHasUnsavedChanges(true);
      }
      
      if (event.data?.type === 'hrefUpdated') {
        setHasUnsavedChanges(true);
      }
      
      if (event.data?.type === 'htmlContent') {
        // Update the current page content with the modified HTML
        const cleanedHtml = cleanVisualEditorHtml(event.data.data.html);
        const updatedContent = {
          ...currentWebsiteContent,
          [effectiveCurrentPage]: cleanedHtml
        };
        setCurrentWebsiteContent(updatedContent);
        setHasUnsavedChanges(false);
        
        // Persist to backend immediately
        persistChangesToBackend(updatedContent);
      }
      
      // Handle image element selection - show image replacer
      if (event.data?.type === 'elementSelected' && event.data.data?.tagName === 'img') {
        setShowImageReplacer(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentWebsiteContent, mode, effectiveCurrentPage]);

  // Load site data and check preview
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`);
        if (response.ok) {
          const data = await response.json();
          const siteData = data.data || data.site || data;
          
          if (siteData.websiteContent) {
            setCurrentWebsiteContent(siteData.websiteContent);
          }
          if (siteData.messages) {
            setMessages(siteData.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          }
        }
      } catch (error) {
        console.error('Error loading site data:', error);
      }
      
      checkPreviewReady();
    };
    
    loadSiteData();
    
    // Auto-send initial prompt if provided
    if (site.initialPrompt) {
      setTimeout(() => {
        handleSendMessage(site.initialPrompt!);
      }, 500);
    }
  }, [site.id]);

  // Update preview when content, page, or mode changes
  useEffect(() => {
    if (currentWebsiteContent && currentWebsiteContent[effectiveCurrentPage]) {
      checkPreviewReady();
    }
  }, [currentWebsiteContent, effectiveCurrentPage, mode]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (site.id && Object.keys(currentWebsiteContent).length > 0) {
        saveSiteData();
      }
    };
  }, [site.id, currentWebsiteContent]);

  // Clean visual editor artifacts from HTML
  const cleanVisualEditorHtml = (html: string): string => {
    if (!html) return html;
    
    // Remove the visual editor script block (it starts with our IIFE pattern)
    html = html.replace(/<script>\s*\(function\(\)\s*\{\s*let selectedElement[\s\S]*?<\/script>/gi, '');
    
    // Remove any script that contains our visual editor markers
    html = html.replace(/<script>[\s\S]*?avallon-selection-overlay[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>[\s\S]*?avallon-hover-overlay[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>[\s\S]*?avallon-handle[\s\S]*?<\/script>/gi, '');
    
    // Remove inline styles that contain pointer-events: none and cursor: default on body
    html = html.replace(/<style>\s*\*\s*\{\s*cursor:\s*default[^}]*\}[\s\S]*?<\/style>/gi, '');
    
    // Remove avallon overlay divs
    html = html.replace(/<div[^>]*id="avallon-selection-overlay"[^>]*>[\s\S]*?<\/div>/gi, '');
    html = html.replace(/<div[^>]*id="avallon-hover-overlay"[^>]*>[\s\S]*?<\/div>/gi, '');
    html = html.replace(/<div[^>]*class="[^"]*avallon-handle[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    
    // Remove any orphaned avallon elements
    html = html.replace(/<[^>]+id="avallon-[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, '');
    
    // Remove data attributes we may have added
    html = html.replace(/\s+data-avallon-[a-z-]+="[^"]*"/gi, '');
    
    // Remove inline style that was added for editing (contenteditable outline)
    html = html.replace(/\s+contenteditable="[^"]*"/gi, '');
    
    // Clean up any empty script tags
    html = html.replace(/<script>\s*<\/script>/gi, '');
    
    return html;
  };

  const saveSiteData = async () => {
    try {
      await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          })),
          websiteContent: currentWebsiteContent,
          status: 'deployed',
        }),
      });
    } catch (error) {
      console.error('Error saving site:', error);
    }
  };

  const checkPreviewReady = () => {
    const pageToShow = effectiveCurrentPage;
    if (currentWebsiteContent && currentWebsiteContent[pageToShow]) {
      let htmlContent = currentWebsiteContent[pageToShow];
      htmlContent = htmlContent.trim();
      if (htmlContent.startsWith('```html')) {
        htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/\n?```$/, '');
      } else if (htmlContent.startsWith('```')) {
        htmlContent = htmlContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      htmlContent = fixImageUrls(htmlContent);
      htmlContent = injectNavigationScript(htmlContent);
      
      // Inject visual editor script when in visual mode
      if (mode === 'visual') {
        const visualScript = getVisualEditorScript();
        if (htmlContent.includes('</body>')) {
          htmlContent = htmlContent.replace('</body>', visualScript + '</body>');
        } else if (htmlContent.includes('</html>')) {
          htmlContent = htmlContent.replace('</html>', visualScript + '</html>');
        } else {
          htmlContent += visualScript;
        }
      }
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
      setPreviewReady(true);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Start progress simulation
    const hasContent = currentWebsiteContent && Object.keys(currentWebsiteContent).length > 0;
    const isNewSite = site.status === 'generating' || !hasContent;
    
    const progressSteps = isNewSite ? [
      { step: 'Analyzing your request', detail: 'Understanding what you want...', percent: 10 },
      { step: 'Designing layout', detail: 'Planning sections and structure...', percent: 25 },
      { step: 'Generating HTML', detail: 'Building the page structure...', percent: 40 },
      { step: 'Applying styles', detail: 'Adding colors, fonts, and spacing...', percent: 55 },
      { step: 'Adding images', detail: 'Selecting relevant imagery...', percent: 70 },
      { step: 'Adding interactions', detail: 'Implementing hover effects...', percent: 85 },
      { step: 'Finalizing', detail: 'Polishing the final result...', percent: 95 },
    ] : [
      { step: 'Understanding changes', detail: 'Analyzing your modification request...', percent: 20 },
      { step: 'Updating code', detail: 'Making the requested changes...', percent: 50 },
      { step: 'Applying changes', detail: 'Integrating updates...', percent: 80 },
      { step: 'Verifying', detail: 'Ensuring everything works...', percent: 95 },
    ];

    let stepIndex = 0;
    setGenerationProgress(progressSteps[0]);
    
    progressIntervalRef.current = setInterval(() => {
      stepIndex++;
      if (stepIndex < progressSteps.length) {
        setGenerationProgress(progressSteps[stepIndex]);
      }
    }, isNewSite ? 4000 : 2000);

    try {
      const requestBody = {
        name: site.name,
        description: textToSend,
        siteId: site.id,
        mode: 'full',
        multiPage: true,
        messages: [...messages, userMessage].map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        currentCode: currentWebsiteContent || {}
      };

      const response = await fetchWithAuth(`${baseUrl}/api/sites/generate`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate website');
      }

      const result = await response.json();
      
      // Check if there's an error in the result
      if (result.error) {
        throw new Error(result.message || result.error || 'Failed to generate website');
      }
      
      // Update content
      const websiteContent = result.websiteContent || result.files || result.result?.websiteContent || {};
      if (Object.keys(websiteContent).length === 0) {
        throw new Error(result.message || 'No website content was generated. Please try again.');
      }
      
      setCurrentWebsiteContent(websiteContent);

      // Add AI response
      const changes = Object.keys(websiteContent).length > 0 
        ? [`Updated ${Object.keys(websiteContent).length} file(s)`]
        : [];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isNewSite 
          ? "I've generated your website! You can see the preview on the right. Let me know if you'd like any changes."
          : "Done! I've made the changes you requested. The preview has been updated.",
        timestamp: new Date(),
        changes,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update site - use result.result if available, otherwise use result
      const siteData = result.result || result;
      onUpdate({
        ...site,
        ...siteData,
        websiteContent,
        status: 'deployed',
      });

      // Save
      await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          messages: [...messages, userMessage, assistantMessage].map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          })),
          websiteContent: websiteContent || currentWebsiteContent,
          status: 'deployed',
        }),
      });

      toast({
        title: isNewSite ? "Website Generated!" : "Changes Applied!",
        description: "Your website has been updated successfully.",
      });

    } catch (error: any) {
      console.error('Error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to process your request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setGenerationProgress(null);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/sites/deploy/vercel`, {
        method: 'POST',
        body: JSON.stringify({ siteId: site.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to deploy');
      }

      const result = await response.json();
      
      toast({
        title: "🚀 Published!",
        description: result.previewUrl 
          ? `Your site is live at ${result.previewUrl}` 
          : "Your website has been published!",
      });

      if (result.previewUrl) {
        window.open(result.previewUrl, '_blank');
        onUpdate({ ...site, previewUrl: result.previewUrl, status: 'deployed' });
      }
    } catch (error: any) {
      console.error('Deploy error:', error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to publish website",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'tablet': return 'max-w-[768px]';
      case 'mobile': return 'max-w-[375px]';
      default: return 'w-full max-w-[1200px]';
    }
  };

  // Visual editor functions
  const updateElementStyle = (property: string, value: string) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: 'updateStyle', property, value }, '*');
  };

  const updateElementContent = (content: string) => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: 'updateContent', content }, '*');
  };

  const deleteElement = () => {
    if (!iframeRef.current?.contentWindow || !selectedElement) return;
    iframeRef.current.contentWindow.postMessage({ type: 'deleteElement' }, '*');
    setSelectedElement(null);
  };

  const duplicateElement = () => {
    if (!iframeRef.current?.contentWindow || !selectedElement) return;
    iframeRef.current.contentWindow.postMessage({ type: 'duplicateElement' }, '*');
  };

  const saveVisualChanges = async () => {
    if (!iframeRef.current?.contentWindow) return;
    
    // Request the current HTML from the iframe
    iframeRef.current.contentWindow.postMessage({ type: 'getHTML' }, '*');
    
    // The actual save will happen in the message handler when we receive 'htmlContent'
    // But let's also trigger an immediate save to the backend
    toast({
      title: "Saving...",
      description: "Saving your visual changes...",
    });
  };

  // Save changes to backend
  const persistChangesToBackend = async (updatedContent: Record<string, string>) => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          websiteContent: updatedContent,
          status: 'deployed',
        }),
      });
      
      if (response.ok) {
        const updatedSite = await response.json();
        toast({
          title: "Saved!",
          description: "Your changes have been saved successfully.",
        });
        onUpdate({ ...site, websiteContent: updatedContent, status: 'deployed', ...updatedSite });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.message || errorData.error || 'Failed to save';
        
        // If site not found, try to create it
        if (response.status === 404) {
          console.warn('Site not found, attempting to create it...');
          // Site might not exist yet - this is okay for new sites
          toast({
            title: "Note",
            description: "Site will be saved when you publish it.",
          });
          return;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Auto-save website content to backend
  const autoSaveContent = async (content: Record<string, string>) => {
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          websiteContent: content,
          status: 'deployed',
        }),
      });
      
      if (response.ok) {
        const updatedSite = await response.json();
        onUpdate({ ...site, websiteContent: content, status: 'deployed', ...updatedSite });
        setHasUnsavedChanges(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  };

  // Handle importing website HTML
  const handleImportWebsite = async (html: string, pageName: string = 'index.html') => {
    // The HTML has already been fully processed by ImportWebsiteModal
    // (with CSS inlined, URLs converted, etc.)
    
    // Update the website content
    const updatedContent = {
      ...currentWebsiteContent,
      [pageName]: html,
    };
    
    setCurrentWebsiteContent(updatedContent);
    setCurrentPage(pageName);
    
    // Auto-save to backend
    const saved = await autoSaveContent(updatedContent);
    
    // Add a message to chat
    const importMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ Successfully imported website to "${pageName}"!${saved ? ' (Auto-saved)' : ''}\n\nAll external CSS stylesheets have been fetched and embedded inline. Images, fonts, and other resources have been converted to absolute URLs.\n\nYou can now:\n• Use the Visual Editor to make changes\n• Use AI Assist to modify sections\n• Click "Publish" to deploy your website\n• Click "Download" to get files for self-hosting`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, importMessage]);
    
    toast({
      title: "Website Imported & Saved!",
      description: saved ? `Ready to publish or download for self-hosting.` : `Click Save to persist changes.`,
    });
    
    setShowImportModal(false);
  };
  
  // Handle multi-page import
  const handleMultiPageImport = async (pages: Array<{ filename: string; html: string; title: string; url?: string }>) => {
    // Build the new content with all pages
    const updatedContent: Record<string, string> = { ...currentWebsiteContent };
    
    for (const page of pages) {
      updatedContent[page.filename] = page.html;
    }
    
    setCurrentWebsiteContent(updatedContent);
    
    // Set current page to the first imported page (usually index.html)
    const firstPage = pages[0]?.filename || 'index.html';
    setCurrentPage(firstPage);
    
    // Auto-save to backend
    const saved = await autoSaveContent(updatedContent);
    
    // Add a message to chat
    const pageNames = pages.map(p => p.filename).join(', ');
    const importMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ Successfully imported ${pages.length} pages!${saved ? ' (Auto-saved)' : ''}\n\n**Pages imported:**\n${pages.map(p => `• ${p.filename} (${p.title})`).join('\n')}\n\nAll CSS stylesheets have been fetched and embedded inline. Images, fonts, and other resources have been converted to absolute URLs.\n\nYou can switch between pages using the page selector at the top. Click "Publish" to deploy or "Download" for self-hosting.`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, importMessage]);
    
    toast({
      title: `${pages.length} Pages Imported & Saved!`,
      description: saved ? `Ready to publish or download.` : `Imported: ${pageNames}. Click Save.`,
    });
    
    setShowImportModal(false);
  };
  
  // Custom domain state
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [domainLoading, setDomainLoading] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<Array<{ type: string; name: string; value: string }>>([]);
  
  // Add custom domain
  const handleAddDomain = async () => {
    if (!customDomain.trim()) return;
    
    setDomainLoading(true);
    try {
      const response = await fetchWithAuth(`${baseUrl}/api/sites/${site.id}/domain`, {
        method: 'POST',
        body: JSON.stringify({ domain: customDomain.trim() }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDnsRecords(data.dnsRecords || []);
        toast({
          title: "Domain Added!",
          description: "Now add the DNS records shown below to connect your domain.",
        });
      } else {
        toast({
          title: "Failed to Add Domain",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add domain.",
        variant: "destructive",
      });
    } finally {
      setDomainLoading(false);
    }
  };

  // Download website as ZIP for self-hosting
  const handleDownloadZip = async () => {
    if (Object.keys(currentWebsiteContent).length === 0) {
      toast({
        title: "No Content",
        description: "There's no website content to download.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add all HTML files
      for (const [filename, content] of Object.entries(currentWebsiteContent)) {
        zip.file(filename, content);
      }
      
      // Add a simple README
      zip.file('README.md', `# ${site.name}

Website exported from Avallon.

## Self-Hosting Instructions

### Option 1: Simple HTTP Server
\`\`\`bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
\`\`\`

### Option 2: Nginx
Copy all files to your nginx html directory (usually \`/var/www/html\`).

### Option 3: Apache
Copy all files to your Apache document root (usually \`/var/www/html\` or \`htdocs\`).

### Option 4: Vercel/Netlify
Just drag and drop this folder to deploy.

## Files
${Object.keys(currentWebsiteContent).map(f => `- ${f}`).join('\n')}

Generated by Avallon - ${new Date().toISOString()}
`);
      
      // Generate ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${site.slug || site.name || 'website'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "Your website has been downloaded as a ZIP file. Extract and host anywhere!",
      });
    } catch (error: any) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to create ZIP file.",
        variant: "destructive",
      });
    }
  };

  // Handle paste in chat - detect HTML and offer to import
  const handleChatPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Check if pasted content looks like HTML
    if (pastedText.length > 500 && isHTML(pastedText)) {
      e.preventDefault();
      
      // Ask user if they want to import
      const wantToImport = window.confirm(
        "It looks like you pasted HTML code. Would you like to import it as a website?\n\nClick OK to open the Import dialog for full processing, or Cancel to paste as text."
      );
      
      if (wantToImport) {
        // Open the import modal instead - it handles full processing
        setShowImportModal(true);
        // The user can paste again in the modal
        toast({
          title: "Import Dialog Opened",
          description: "Paste your HTML in the dialog for full processing with CSS inlining.",
        });
      } else {
        setInput(prev => prev + pastedText);
      }
    }
  };

  const handleAiAssist = async () => {
    if (!aiAssistInput.trim() || isAiAssistLoading) return;
    
    setIsAiAssistLoading(true);
    try {
      let prompt = aiAssistInput;
      
      // If an element is selected, make the prompt more specific
      if (selectedElement) {
        prompt = `For the ${selectedElement.tagName} element${selectedElement.id ? ` with id="${selectedElement.id}"` : ''}${selectedElement.className ? ` with class="${selectedElement.className.split(' ')[0]}"` : ''}, ${aiAssistInput}. Make sure to preserve the overall design while making this specific change.`;
      }
      
      // Send to the AI
      await handleSendMessage(prompt);
      setAiAssistInput('');
    } catch (error) {
      console.error('AI Assist error:', error);
      toast({
        title: "Error",
        description: "Failed to process AI request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiAssistLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Check if selected element is image-related
  const isImageElement = (element: SelectedElement | null): boolean => {
    if (!element) return false;
    const tagName = element.tagName?.toLowerCase();
    if (tagName === 'img' || tagName === 'picture') return true;
    if (element.styles?.backgroundImage && element.styles.backgroundImage !== 'none') return true;
    if (element.path?.some(p => p.includes('img') || p.includes('image'))) return true;
    return false;
  };

  // Replace image in selected element
  const replaceSelectedImage = (newUrl: string) => {
    if (!iframeRef.current?.contentWindow || !selectedElement) {
      toast({
        title: "Error",
        description: "No element selected. Please select an image first.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    if (!newUrl || !newUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    // Ensure URL is absolute
    let imageUrl = newUrl.trim();
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
      // If it's a relative path, try to make it absolute
      if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
      } else {
        imageUrl = 'https://' + imageUrl;
      }
    }

    // Send replacement message to iframe
    iframeRef.current.contentWindow.postMessage({ 
      type: 'replaceImage', 
      url: imageUrl 
    }, '*');
    
    setHasUnsavedChanges(true);
    setShowImageReplacer(false);
    setImageReplaceUrl('');
    
    toast({
      title: "Image Updated",
      description: "The image has been replaced. Click Save to keep changes.",
    });
  };

  // Parse spacing values
  const parseSpacing = (value: string): { top: string; right: string; bottom: string; left: string } => {
    const parts = value.split(' ').map(p => p.trim()).filter(Boolean);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length === 2) return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    if (parts.length === 3) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    if (parts.length === 4) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
  };

  // RGB to Hex converter
  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return rgb;
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  // Numeric input with increment/decrement controls - fully editable
  const NumericInput = ({ 
    value, 
    onChange, 
    min = 0, 
    max = 1000, 
    step = 1,
    unit = 'px',
    className = ''
  }: {
    value: string;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    className?: string;
  }) => {
    // Local state for immediate input feedback
    const [localValue, setLocalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const justAppliedRef = useRef(false);
    
    // Sync with external value ONLY when not focused and we didn't just apply a change
    useEffect(() => {
      if (!isFocused && !justAppliedRef.current) {
        setLocalValue(value);
      }
      justAppliedRef.current = false;
    }, [value, isFocused]);
    
    // Parse numeric value from string like "16px" or "1.5rem"
    const parseValue = (val: string): number => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };
    
    const getUnit = (val: string): string => {
      const match = val.match(/[a-z%]+$/i);
      return match ? match[0] : unit;
    };
    
    const numValue = parseValue(localValue);
    const currentUnit = getUnit(localValue || value);
    
    const applyChange = (newValue: string) => {
      justAppliedRef.current = true;
      setLocalValue(newValue);
      onChange(newValue);
    };
    
    const increment = () => {
      const newVal = Math.min(numValue + step, max);
      const newValueStr = `${newVal}${currentUnit}`;
      applyChange(newValueStr);
    };
    
    const decrement = () => {
      const newVal = Math.max(numValue - step, min);
      const newValueStr = `${newVal}${currentUnit}`;
      applyChange(newValueStr);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value;
      setLocalValue(inputVal);
      // Apply change immediately for live preview
      if (inputVal) {
        let valueToApply = inputVal;
        if (!isNaN(parseFloat(inputVal)) && !/[a-z%]+$/i.test(inputVal)) {
          valueToApply = `${parseFloat(inputVal)}${currentUnit}`;
        }
        justAppliedRef.current = true;
        onChange(valueToApply);
      }
    };
    
    const handleBlur = () => {
      // Ensure value has unit when blurring
      let finalValue = localValue;
      if (finalValue && !isNaN(parseFloat(finalValue)) && !/[a-z%]+$/i.test(finalValue)) {
        finalValue = `${parseFloat(finalValue)}${currentUnit}`;
        setLocalValue(finalValue);
      }
      setIsFocused(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        (e.target as HTMLInputElement).blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        increment();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        decrement();
      }
  };

  return (
      <div className={`flex items-center bg-surface-dark border border-panel-border rounded overflow-hidden ${className}`}>
        <button
          onClick={decrement}
          className="px-2 py-1 hover:bg-panel-border text-gray-400 hover:text-white transition-colors active:bg-primary/50"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">remove</span>
        </button>
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-16 px-1 py-1 bg-transparent text-sm text-white text-center outline-none focus:bg-white/5"
        />
        <button
          onClick={increment}
          className="px-2 py-1 hover:bg-panel-border text-gray-400 hover:text-white transition-colors active:bg-primary/50"
          type="button"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
        </button>
      </div>
    );
  };

  return (
    <div className={`font-display overflow-hidden h-screen flex flex-col antialiased ${isLight ? 'bg-gray-50 text-slate-900' : 'bg-background-dark text-white'}`}>
      {/* Top Navigation Bar - Mobile Responsive */}
      <header className={`flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-3 sm:px-6 py-2 sm:py-3 min-h-16 shrink-0 z-20 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111218] border-panel-border'}`}>
        {/* Logo + Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start mb-2 sm:mb-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={onClose}
              className={`flex items-center gap-1 sm:gap-2 transition-colors flex-shrink-0 ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="size-7 sm:size-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">auto_awesome</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight truncate min-w-0">{site.name}</h1>
          </div>
          
          {/* Mode Toggle - Mobile */}
          <div className={`sm:hidden rounded-lg p-0.5 flex shadow-lg flex-shrink-0 ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-[#1a1f2e] border border-[#3a3f52]'}`}>
            <button
              onClick={() => { setMode('ai'); setSelectedElement(null); }}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1 ${
                mode === 'ai' 
                  ? 'bg-primary text-white shadow-md' 
                  : isLight ? 'text-slate-600' : 'text-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </button>
            <button
              onClick={() => setMode('visual')}
              className={`px-2 py-1.5 text-xs font-medium rounded transition-all flex items-center gap-1 ${
                mode === 'visual' 
                  ? 'bg-primary text-white shadow-md' 
                  : isLight ? 'text-slate-600' : 'text-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
        </div>
        
        {/* Mode Toggle + Page Selector - Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <div className={`rounded-lg p-1 flex shadow-lg ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-[#1a1f2e] border border-[#3a3f52]'}`}>
            <button
              onClick={() => { setMode('ai'); setSelectedElement(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                mode === 'ai' 
                  ? 'bg-primary text-white shadow-md' 
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              AI Assist
            </button>
            <button
              onClick={() => setMode('visual')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                mode === 'visual' 
                  ? 'bg-primary text-white shadow-md' 
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Visual Edit
            </button>
          </div>
          
          {/* Page Selector */}
          {availablePages.length > 1 && (
            <div className={`hidden lg:flex rounded-lg p-1 ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-surface-dark border border-panel-border'}`}>
              {availablePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${
                    effectiveCurrentPage === page 
                      ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-panel-border text-white shadow-sm'
                      : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {page.replace('.html', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Buttons - Mobile Optimized */}
        <div className="flex items-center gap-1 sm:gap-3 w-full sm:w-auto justify-end flex-wrap">
          <div className="hidden sm:flex items-center border-r border-panel-border pr-3 gap-1">
            <button 
              className={`size-8 flex items-center justify-center rounded-md transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-panel-border text-gray-400 hover:text-white'}`}
              title="Undo"
            >
              <span className="material-symbols-outlined text-[20px]">undo</span>
            </button>
            <button 
              className={`size-8 flex items-center justify-center rounded-md transition-colors ${isLight ? 'hover:bg-slate-200 text-slate-500 hover:text-slate-900' : 'hover:bg-panel-border text-gray-400 hover:text-white'}`}
              title="Redo"
            >
              <span className="material-symbols-outlined text-[20px]">redo</span>
            </button>
          </div>
          
          {/* Theme Toggle - Icon only on mobile */}
          <div className="hidden sm:block"><ThemeToggleButton /></div>
          
          {/* Code View Button */}
          <button 
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              showCode 
                ? 'bg-purple-600 text-white' 
                : isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-panel-border hover:bg-[#323645] text-white border border-transparent hover:border-gray-600'
            }`}
            title="View Code"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">code</span>
            <span className="hidden sm:inline">Code</span>
          </button>
          
          {/* Import Website Button */}
          <button 
            onClick={() => setShowImportModal(true)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-panel-border hover:bg-[#323645] text-white border border-transparent hover:border-gray-600'}`}
            title="Import"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">upload_file</span>
            <span className="hidden sm:inline">Import</span>
          </button>
          
          {/* Save Visual Changes Button */}
          {mode === 'visual' && hasUnsavedChanges && (
            <button 
              onClick={saveVisualChanges}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm font-medium transition-colors"
              title="Save Changes"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">save</span>
              <span className="hidden sm:inline">Save</span>
            </button>
          )}
          
          <button 
            onClick={() => previewUrl && window.open(previewUrl, '_blank')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-panel-border hover:bg-[#323645] text-white border border-transparent hover:border-gray-600'}`}
            title="Preview"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">visibility</span>
            <span className="hidden sm:inline">Preview</span>
          </button>
          
          {/* Download for Self-Hosting - Icon only on mobile */}
          <button 
            onClick={handleDownloadZip}
            disabled={Object.keys(currentWebsiteContent).length === 0}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            title="Download ZIP"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
            <span className="hidden sm:inline">Download</span>
          </button>
          
          {/* Custom Domain - Icon only on mobile */}
          <button 
            onClick={() => setShowDomainModal(true)}
            disabled={!site.vercelProjectId}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
            title={site.vercelProjectId ? "Add domain" : "Publish first"}
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px]">language</span>
            <span className="hidden sm:inline">Domain</span>
          </button>
          
          {/* Publish Button - Always show text */}
          <button 
            onClick={handleDeploy}
            disabled={isDeploying || Object.keys(currentWebsiteContent).length === 0}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 transition-all glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeploying ? (
              <>
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] animate-spin">progress_activity</span>
                <span className="hidden sm:inline">Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish</span>
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">rocket_launch</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Code View Modal */}
      {showCode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-panel-border shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-panel-border">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-400">code</span>
                <h2 className="text-lg font-bold text-white">View Code</h2>
                <select
                  value={effectiveCurrentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                  className="ml-4 px-3 py-1.5 bg-surface-dark border border-panel-border rounded-lg text-sm text-white"
                >
                  {availablePages.map((page) => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setShowCode(false)}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-panel-border text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words bg-[#0d1117] p-4 rounded-lg border border-panel-border">
                {currentWebsiteContent[effectiveCurrentPage] || 'No content available'}
              </pre>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-panel-border">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentWebsiteContent[effectiveCurrentPage] || '');
                  toast({ title: "Copied!", description: "Code copied to clipboard" });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-dark hover:bg-panel-border text-white text-sm font-medium transition-colors border border-panel-border"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copy Code
              </button>
              <button
                onClick={() => setShowCode(false)}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout - Mobile Responsive */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left Panel: AI Chat or Visual Properties - Hidden on mobile, toggleable */}
        <aside className={`${mode === 'ai' ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-[35%] lg:w-[30%] md:min-w-[320px] md:max-w-[450px] border-r relative z-10 ${isLight ? 'bg-white border-slate-200' : 'bg-[#111218] border-panel-border'}`}>
          {mode === 'ai' ? (
            <>
              {/* AI Mode: Chat Interface */}
              <div className="pt-6 px-6 pb-2">
                <h2 className="text-gradient text-xl font-bold leading-tight mb-1">Tell Avallon what to change.</h2>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Describe your vision, and I'll build it.</p>
              </div>
              
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
                {messages.length === 0 && !isLoading && (
                  <div className="flex gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-surface-dark border border-panel-border'}`}>
                      <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Avallon AI</span>
                      <div className={`rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed ${isLight ? 'bg-slate-100 border border-slate-200 text-slate-700' : 'bg-surface-dark border border-panel-border text-gray-200'}`}>
                        Hi! I'm ready to help you build or modify your website. Describe what you want, and I'll generate it for you.
                      </div>
                    </div>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'user' ? (
                      <div className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                        YO
                      </div>
                    ) : (
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-surface-dark border border-panel-border'}`}>
                        <span className="material-symbols-outlined text-primary text-[18px]">smart_toy</span>
                      </div>
                    )}
                    <div className={`flex flex-col gap-1 max-w-[90%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{msg.role === 'user' ? 'You' : 'Avallon AI'}</span>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-primary rounded-tr-none text-white shadow-md shadow-primary/10' 
                          : isLight ? 'bg-slate-100 border border-slate-200 rounded-tl-none text-slate-700' : 'bg-surface-dark border border-panel-border rounded-tl-none text-gray-200'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.changes && msg.changes.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {msg.changes.map((change, i) => (
                            <div key={i} className="text-xs flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              {change}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && generationProgress && (
                  <div className="flex gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-surface-dark border border-panel-border'}`}>
                      <span className="material-symbols-outlined text-primary text-[18px] animate-spin">progress_activity</span>
                    </div>
                    <div className="flex flex-col gap-1 max-w-[90%]">
                      <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Avallon AI</span>
                      <div className={`rounded-2xl rounded-tl-none px-4 py-3 text-sm leading-relaxed ${isLight ? 'bg-slate-100 border border-slate-200 text-slate-700' : 'bg-surface-dark border border-panel-border text-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary text-[16px] animate-pulse">auto_awesome</span>
                          <span className="font-medium">{generationProgress.step}</span>
                        </div>
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>{generationProgress.detail}</p>
                        <div className={`mt-2 w-full rounded-full h-1.5 ${isLight ? 'bg-slate-200' : 'bg-panel-border'}`}>
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${generationProgress.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
              
              {/* Input Area */}
              <div className={`p-4 border-t ${isLight ? 'bg-white border-slate-200' : 'bg-[#111218] border-panel-border'}`}>
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative shrink-0">
                        <img 
                          src={img} 
                          alt={`Uploaded ${i + 1}`}
                          className="h-16 w-16 object-cover rounded-lg border border-panel-border"
                        />
                        <button
                          onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 size-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Suggestion Chips */}
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-1">
                  {suggestions.map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(suggestion.text)}
                      className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-dark hover:bg-panel-border border border-panel-border transition-colors text-xs text-gray-300"
                    >
                      <span className="material-symbols-outlined text-[14px]">{suggestion.icon}</span>
                      {suggestion.text}
                    </button>
                  ))}
                </div>
                
                {/* Text Input */}
                <div className="relative group">
                  <textarea 
                    className={`w-full text-sm rounded-xl border focus:border-primary focus:ring-1 focus:ring-primary p-4 pr-24 resize-none outline-none transition-all h-24 leading-relaxed ${isLight ? 'bg-slate-100 text-slate-900 border-slate-200 placeholder-slate-400' : 'bg-surface-dark text-white border-panel-border placeholder-gray-500'}`}
                    placeholder="Describe the change you want... (or paste HTML to import)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    onPaste={handleChatPaste}
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {/* Image Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="size-8 bg-surface-dark hover:bg-panel-border text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-colors border border-panel-border"
                      title="Add image for context"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                    </button>
                    
                    {/* Send Button */}
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                      className="size-8 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Avallon v2.4</span>
                  <span className="text-[10px] text-gray-600">Enter to send • Click 📷 to add images</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Visual Mode: Properties Panel */}
              <div className={`pt-6 px-6 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
                <h2 className="text-lg font-bold leading-tight mb-1">Visual Editor</h2>
                <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Click an element to edit its properties.</p>
              </div>
              
              {selectedElement ? (
                <div className="flex-1 overflow-y-auto">
                  {/* Element Breadcrumb */}
                  <div className={`px-6 py-3 border-b ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-surface-dark/50 border-panel-border'}`}>
                    <div className={`flex items-center gap-1 text-xs overflow-x-auto scrollbar-hide ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      {selectedElement.path.map((item, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="material-symbols-outlined text-[12px]">chevron_right</span>}
                          <span className={`${i === selectedElement.path.length - 1 ? 'text-primary font-medium' : ''}`}>
                            {item}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  
                  {/* Element Actions */}
                  <div className={`px-6 py-3 border-b flex gap-2 ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
                    <button
                      onClick={duplicateElement}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600' : 'bg-surface-dark hover:bg-panel-border border-panel-border text-gray-300'}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      Duplicate
                    </button>
                    <button
                      onClick={deleteElement}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm text-red-400 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Delete
                    </button>
                  </div>
                  
                  {/* Properties Tabs */}
                  <div className={`px-6 py-3 border-b ${isLight ? 'border-slate-200' : 'border-panel-border'}`}>
                    <div className={`flex gap-1 rounded-lg p-1 ${isLight ? 'bg-slate-100' : 'bg-surface-dark'}`}>
                      {(['style', 'spacing', 'content'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setPropertiesTab(tab)}
                          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                            propertiesTab === tab
                              ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-panel-border text-white'
                              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Properties Content */}
                  <div className="px-6 py-4 space-y-4">
                    {propertiesTab === 'style' && (
                      <>
                        {/* Typography */}
                        <div className="space-y-3">
                          <h3 className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Typography</h3>
                          
                          {/* Font Size */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Font Size</label>
                            <NumericInput
                                value={selectedElement.styles.fontSize}
                              onChange={(val) => updateElementStyle('fontSize', val)}
                              min={8}
                              max={200}
                              step={1}
                            />
                          </div>
                          
                          {/* Font Weight */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Weight</label>
                            <select
                              value={selectedElement.styles.fontWeight}
                              onChange={(e) => updateElementStyle('fontWeight', e.target.value)}
                              className="px-2 py-1 bg-surface-dark border border-panel-border rounded text-sm text-white"
                            >
                              <option value="300">Light</option>
                              <option value="400">Regular</option>
                              <option value="500">Medium</option>
                              <option value="600">Semibold</option>
                              <option value="700">Bold</option>
                            </select>
                          </div>
                          
                          {/* Text Align */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Align</label>
                            <div className="flex gap-0.5 bg-surface-dark rounded p-0.5 border border-panel-border">
                                <button
                                onClick={() => updateElementStyle('textAlign', 'left')}
                                className={`p-1.5 rounded transition-colors ${selectedElement.styles.textAlign === 'left' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                title="Align Left"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
                                </svg>
                                </button>
                              <button
                                onClick={() => updateElementStyle('textAlign', 'center')}
                                className={`p-1.5 rounded transition-colors ${selectedElement.styles.textAlign === 'center' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                title="Align Center"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => updateElementStyle('textAlign', 'right')}
                                className={`p-1.5 rounded transition-colors ${selectedElement.styles.textAlign === 'right' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                title="Align Right"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => updateElementStyle('textAlign', 'justify')}
                                className={`p-1.5 rounded transition-colors ${selectedElement.styles.textAlign === 'justify' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                                title="Justify"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Colors */}
                        <div className="space-y-3 pt-3 border-t border-panel-border">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Colors</h3>
                          
                          {/* Text Color */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Text</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={rgbToHex(selectedElement.styles.color)}
                                onChange={(e) => updateElementStyle('color', e.target.value)}
                                className="w-8 h-8 rounded border border-panel-border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={rgbToHex(selectedElement.styles.color)}
                                onChange={(e) => updateElementStyle('color', e.target.value)}
                                className="w-24 px-2 py-1 bg-surface-dark border border-panel-border rounded text-sm text-white"
                              />
                            </div>
                          </div>
                          
                          {/* Background Color */}
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Background</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={rgbToHex(selectedElement.styles.backgroundColor)}
                                onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                                className="w-8 h-8 rounded border border-panel-border cursor-pointer"
                              />
                              <input
                                type="text"
                                value={rgbToHex(selectedElement.styles.backgroundColor)}
                                onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                                className="w-24 px-2 py-1 bg-surface-dark border border-panel-border rounded text-sm text-white"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Border Radius */}
                        <div className="space-y-3 pt-3 border-t border-panel-border">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Border</h3>
                          <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Radius</label>
                            <NumericInput
                              value={selectedElement.styles.borderRadius}
                              onChange={(val) => updateElementStyle('borderRadius', val)}
                              min={0}
                              max={100}
                              step={1}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    {propertiesTab === 'spacing' && (
                      <>
                        {/* Visual Spacing Box */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Margin</h3>
                          <div className="relative bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                            <div className="text-[10px] text-orange-400 absolute top-1 left-2">margin</div>
                            {/* Margin inputs */}
                            <div className="flex justify-center mb-2">
                              <input
                                type="text"
                                value={parseSpacing(selectedElement.styles.margin).top}
                                onChange={(e) => {
                                  const m = parseSpacing(selectedElement.styles.margin);
                                  updateElementStyle('margin', `${e.target.value} ${m.right} ${m.bottom} ${m.left}`);
                                }}
                                className="w-12 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                value={parseSpacing(selectedElement.styles.margin).left}
                                onChange={(e) => {
                                  const m = parseSpacing(selectedElement.styles.margin);
                                  updateElementStyle('margin', `${m.top} ${m.right} ${m.bottom} ${e.target.value}`);
                                }}
                                className="w-12 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                              />
                              
                              {/* Padding box inside */}
                              <div className="relative bg-green-500/10 border border-green-500/30 rounded p-3 flex-1 mx-2">
                                <div className="text-[10px] text-green-400 absolute top-0.5 left-1">padding</div>
                                <div className="flex justify-center mb-1 mt-2">
                                  <input
                                    type="text"
                                    value={parseSpacing(selectedElement.styles.padding).top}
                                    onChange={(e) => {
                                      const p = parseSpacing(selectedElement.styles.padding);
                                      updateElementStyle('padding', `${e.target.value} ${p.right} ${p.bottom} ${p.left}`);
                                    }}
                                    className="w-10 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <input
                                    type="text"
                                    value={parseSpacing(selectedElement.styles.padding).left}
                                    onChange={(e) => {
                                      const p = parseSpacing(selectedElement.styles.padding);
                                      updateElementStyle('padding', `${p.top} ${p.right} ${p.bottom} ${e.target.value}`);
                                    }}
                                    className="w-10 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                                  />
                                  <div className="bg-blue-500/20 border border-blue-500/30 rounded px-4 py-2 text-[10px] text-blue-400">
                                    content
                                  </div>
                                  <input
                                    type="text"
                                    value={parseSpacing(selectedElement.styles.padding).right}
                                    onChange={(e) => {
                                      const p = parseSpacing(selectedElement.styles.padding);
                                      updateElementStyle('padding', `${p.top} ${e.target.value} ${p.bottom} ${p.left}`);
                                    }}
                                    className="w-10 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                                  />
                                </div>
                                <div className="flex justify-center mt-1">
                                  <input
                                    type="text"
                                    value={parseSpacing(selectedElement.styles.padding).bottom}
                                    onChange={(e) => {
                                      const p = parseSpacing(selectedElement.styles.padding);
                                      updateElementStyle('padding', `${p.top} ${p.right} ${e.target.value} ${p.left}`);
                                    }}
                                    className="w-10 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                                  />
                                </div>
                              </div>
                              
                              <input
                                type="text"
                                value={parseSpacing(selectedElement.styles.margin).right}
                                onChange={(e) => {
                                  const m = parseSpacing(selectedElement.styles.margin);
                                  updateElementStyle('margin', `${m.top} ${e.target.value} ${m.bottom} ${m.left}`);
                                }}
                                className="w-12 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                              />
                            </div>
                            <div className="flex justify-center mt-2">
                              <input
                                type="text"
                                value={parseSpacing(selectedElement.styles.margin).bottom}
                                onChange={(e) => {
                                  const m = parseSpacing(selectedElement.styles.margin);
                                  updateElementStyle('margin', `${m.top} ${m.right} ${e.target.value} ${m.left}`);
                                }}
                                className="w-12 px-1 py-0.5 bg-surface-dark border border-panel-border rounded text-xs text-white text-center"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Size */}
                        <div className="space-y-3 pt-3 border-t border-panel-border">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Size</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Width</label>
                              <NumericInput
                                value={selectedElement.styles.width}
                                onChange={(val) => updateElementStyle('width', val)}
                                min={0}
                                max={2000}
                                step={10}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Height</label>
                              <NumericInput
                                value={selectedElement.styles.height}
                                onChange={(val) => updateElementStyle('height', val)}
                                min={0}
                                max={2000}
                                step={10}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {propertiesTab === 'content' && (
                      <>
                        {/* Image Replacement - Show when an image element is selected */}
                        {isImageElement(selectedElement) && (
                          <div className="space-y-3 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-[14px]">image</span>
                              Replace Image
                            </h3>
                            <div className="space-y-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={imageReplaceUrl}
                                  onChange={(e) => setImageReplaceUrl(e.target.value)}
                                  placeholder="Enter image URL..."
                                  className="w-full px-3 py-2 bg-surface-dark border border-panel-border rounded-lg text-sm text-white placeholder-gray-500"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  if (imageReplaceUrl.trim()) {
                                    replaceSelectedImage(imageReplaceUrl.trim());
                                  }
                                }}
                                disabled={!imageReplaceUrl.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                Replace with URL
                              </button>
                              
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-panel-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                  <span className="bg-[#111218] px-2 text-gray-500">or upload</span>
                                </div>
                              </div>
                              
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      if (event.target?.result) {
                                        replaceSelectedImage(event.target.result as string);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="image-upload-replace"
                              />
                              <label
                                htmlFor="image-upload-replace"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-dark hover:bg-panel-border border border-panel-border text-white text-sm font-medium transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">upload</span>
                                Upload Image
                              </label>
                            </div>
                          </div>
                        )}
                        
                        {/* Link/Button URL - Show for clickable elements */}
                        {(selectedElement.isClickable || selectedElement.tagName === 'a' || selectedElement.tagName === 'button') && (
                          <div className="space-y-3 mb-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              Link URL
                            </h3>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={selectedElement.href || ''}
                                onChange={(e) => {
                                  const newHref = e.target.value;
                                  setSelectedElement({ ...selectedElement, href: newHref });
                                }}
                                onBlur={(e) => {
                                  const newHref = e.target.value;
                                  if (newHref !== selectedElement.href) {
                                    // Send message to iframe to update href
                                    const iframe = document.querySelector('iframe');
                                    if (iframe?.contentWindow) {
                                      iframe.contentWindow.postMessage({
                                        type: 'updateHref',
                                        href: newHref
                                      }, '*');
                                    }
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                  }
                                }}
                                placeholder="https://example.com or #section"
                                className="w-full px-3 py-2 bg-surface-dark border border-panel-border rounded-lg text-sm text-white placeholder-gray-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (iframeRef.current?.contentWindow) {
                                      iframeRef.current.contentWindow.postMessage({
                                        type: 'updateHref',
                                        href: selectedElement.href || ''
                                      }, '*');
                                      setHasUnsavedChanges(true);
                                      toast({
                                        title: "Link Applied",
                                        description: "Don't forget to save your changes!",
                                      });
                                    }
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                  </svg>
                                  Apply Link
                                </button>
                                {selectedElement.href && (
                                  <button
                                    onClick={() => {
                                      window.open(selectedElement.href, '_blank');
                                    }}
                                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-dark hover:bg-panel-border border border-panel-border text-white text-sm font-medium transition-colors"
                                    title="Test link in new tab"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                      <polyline points="15 3 21 3 21 9"/>
                                      <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-500">
                                Use full URLs (https://...), relative paths (/page), or anchors (#section)
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Text Content - Show for non-image elements */}
                        {selectedElement.tagName !== 'img' && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text Content</h3>
                          <textarea
                            value={selectedElement.content}
                            onChange={(e) => {
                              setSelectedElement({ ...selectedElement, content: e.target.value });
                              updateElementContent(e.target.value);
                            }}
                            className="w-full h-32 px-3 py-2 bg-surface-dark border border-panel-border rounded-lg text-sm text-white resize-none"
                            placeholder="Enter text content..."
                          />
                        </div>
                        )}
                        
                        {/* Element Info */}
                        <div className="space-y-3 pt-3 border-t border-panel-border">
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Element Info</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tag</span>
                              <span className="text-white font-mono">{selectedElement.tagName}</span>
                            </div>
                            {selectedElement.id && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">ID</span>
                                <span className="text-white font-mono">#{selectedElement.id}</span>
                              </div>
                            )}
                            {selectedElement.className && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Class</span>
                                <span className="text-white font-mono text-xs truncate max-w-[150px]">.{selectedElement.className.split(' ')[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* AI Assist Micro-tool */}
                  <div className="p-4 border-t border-panel-border bg-surface-dark/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[16px]">auto_awesome</span>
                      <span className="text-xs font-semibold text-gray-300">AI Assist</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={aiAssistInput}
                        onChange={(e) => setAiAssistInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAiAssist();
                          }
                        }}
                        placeholder="e.g., Make this text larger..."
                        className="w-full px-3 py-2 pr-10 bg-background-dark border border-panel-border rounded-lg text-sm text-white placeholder-gray-500"
                      />
                      <button
                        onClick={handleAiAssist}
                        disabled={!aiAssistInput.trim() || isAiAssistLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 disabled:opacity-50"
                      >
                        {isAiAssistLoading ? (
                          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center px-6">
                  <div className="text-center">
                    <div className="size-16 rounded-full bg-surface-dark border border-panel-border flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-[32px] text-gray-500">touch_app</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Select an Element</h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Click on any element in the preview to edit its properties, styles, and content.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Right Panel: Live Preview */}
        <main className={`flex-1 p-4 lg:p-6 flex flex-col relative overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-[#0a0a0c]'}`}>
          {/* Viewport Selector */}
          <div className="absolute top-4 right-6 flex gap-1 z-10">
            <button 
              onClick={() => setViewport('desktop')}
              className={`p-2 rounded transition-colors ${viewport === 'desktop' ? isLight ? 'text-slate-900 bg-white shadow-sm' : 'text-white bg-white/10' : isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
            </button>
            <button 
              onClick={() => setViewport('tablet')}
              className={`p-2 rounded transition-colors ${viewport === 'tablet' ? isLight ? 'text-slate-900 bg-white shadow-sm' : 'text-white bg-white/10' : isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">tablet_mac</span>
            </button>
            <button 
              onClick={() => setViewport('mobile')}
              className={`p-2 rounded transition-colors ${viewport === 'mobile' ? isLight ? 'text-slate-900 bg-white shadow-sm' : 'text-white bg-white/10' : isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
            </button>
          </div>

          {/* Browser Container */}
          <div className={`flex flex-col h-full ${getViewportWidth()} mx-auto bg-white rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 ${isLight ? 'ring-1 ring-slate-300' : 'ring-1 ring-white/10'}`}>
            {/* Browser Chrome */}
            <div className="h-10 bg-[#f1f3f6] border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                <div className="size-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
                <div className="size-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
              </div>
              <div className="bg-white border border-gray-300 rounded-md px-3 py-1 flex items-center gap-2 w-64 md:w-96 shadow-sm">
                <span className="material-symbols-outlined text-gray-400 text-[14px]">lock</span>
                <span className="text-xs text-gray-600 font-medium truncate">
                  {site.previewUrl?.replace('https://', '') || `preview.avallon.site/${site.slug}`}
                </span>
              </div>
              <div className="w-20 flex justify-end">
                {mode === 'visual' && (
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Editing
                  </span>
                )}
              </div>
            </div>
            
            {/* Website Content */}
            <div className="flex-1 overflow-hidden bg-white relative">
              {previewReady && previewUrl ? (
                <iframe
                  ref={iframeRef}
                  id="preview-iframe"
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Website Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4 block">web</span>
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      {Object.keys(currentWebsiteContent).length > 0 ? 'Loading preview...' : 'No Preview Yet'}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                      {Object.keys(currentWebsiteContent).length > 0 
                        ? 'Generating preview from your content...'
                        : 'Describe your website in the chat to generate it.'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Live Update Indicator */}
              {previewReady && (
                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 shadow-xl">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {mode === 'visual' ? 'Visual Edit Mode' : 'Live Preview'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Import Website Modal */}
      <ImportWebsiteModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportWebsite}
        onMultiPageImport={handleMultiPageImport}
        isLight={isLight}
      />
      
      {/* Custom Domain Modal - Mobile Responsive */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl overflow-y-auto ${isLight ? 'bg-white' : 'bg-[#1a1f2e] border border-panel-border'}`}>
            <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b sticky top-0 ${isLight ? 'bg-white border-slate-200' : 'bg-[#1a1f2e] border-panel-border'}`}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-400">language</span>
                <h2 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Custom Domain</h2>
              </div>
              <button 
                onClick={() => { setShowDomainModal(false); setDnsRecords([]); setCustomDomain(''); }}
                className={`size-8 flex items-center justify-center rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-panel-border text-gray-400 hover:text-white'}`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              {/* Current URL */}
              {site.previewUrl && (
                <div className={`p-3 rounded-lg ${isLight ? 'bg-slate-100' : 'bg-surface-dark'}`}>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Current URL</p>
                  <a href={site.previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs sm:text-sm break-all">
                    {site.previewUrl}
                  </a>
                </div>
              )}
              
              {/* Add Domain Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                  Add Your Domain
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="example.com or www.example.com"
                    className={`flex-1 px-3 sm:px-4 py-2.5 rounded-lg border text-sm ${isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-surface-dark border-panel-border text-white'}`}
                  />
                  <button
                    onClick={handleAddDomain}
                    disabled={domainLoading || !customDomain.trim()}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    {domainLoading ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              </div>
              
              {/* DNS Records - Mobile Friendly */}
              {dnsRecords.length > 0 && (
                <div className={`p-3 sm:p-4 rounded-lg border ${isLight ? 'bg-green-50 border-green-200' : 'bg-green-900/20 border-green-800'}`}>
                  <h3 className={`font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base ${isLight ? 'text-green-800' : 'text-green-400'}`}>
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">check_circle</span>
                    Add these DNS records:
                  </h3>
                  <div className="space-y-2">
                    {dnsRecords.map((record, i) => (
                      <div key={i} className={`p-3 rounded-lg font-mono text-xs sm:text-sm ${isLight ? 'bg-white' : 'bg-surface-dark'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2">
                          <div>
                            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Type</span>
                            <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>{record.type}</p>
                          </div>
                          <div>
                            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Name</span>
                            <p className={isLight ? 'text-slate-800' : 'text-white break-all'}>{record.name || '@'}</p>
                          </div>
                          <div className="sm:col-span-1 col-span-1">
                            <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Value</span>
                            <p className={`break-all ${isLight ? 'text-slate-800' : 'text-white'}`} title={record.value}>{record.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className={`mt-3 text-xs ${isLight ? 'text-green-700' : 'text-green-400'}`}>
                    DNS changes can take up to 24-48 hours to propagate.
                  </p>
                </div>
              )}
              
              {/* Instructions */}
              <div className={`text-sm ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                <p className="font-medium mb-2">How to connect your domain:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Enter your domain above and click "Add"</li>
                  <li>Go to your domain registrar (GoDaddy, Namecheap, etc.)</li>
                  <li>Add the DNS records shown</li>
                  <li>Wait for DNS to propagate (usually 5-30 minutes)</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteEditor;
