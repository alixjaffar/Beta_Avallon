/**
 * WordPress imports reference scripts/styles on the original domain. When the page runs on
 * Avallon (avallon.ca), those URLs often return 403 (hotlink / referrer rules), so Swiper
 * and wp.domReady never load. This module rewrites Swiper to jsDelivr and stubs minimal wp.
 */

const PROXY_PATH = '/api/proxy/image';

const JSD_SWIPER_JS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
const JSD_SWIPER_CSS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';

export function hasJsdelivrSwiperScript(html: string): boolean {
  return /cdn\.jsdelivr\.net\/npm\/swiper[^"']*swiper-bundle[^"']*\.js/i.test(html);
}

function normalizeApiBase(apiBase: string): string {
  return (apiBase || '').trim().replace(/\/+$/, '');
}

function extractBaseHref(html: string): string | null {
  const m = html.match(/<base[^>]+href=["']([^"']+)["']/i);
  if (!m?.[1]) return null;
  let href = m[1].trim();
  try {
    if (href.startsWith('//')) href = 'https:' + href;
    if (!/^https?:\/\//i.test(href)) return null;
    return href.endsWith('/') ? href : href + '/';
  } catch {
    return null;
  }
}

function isSkippableUrl(href: string): boolean {
  const l = href.trim();
  if (!l) return true;
  if (l.startsWith('data:') || l.startsWith('blob:')) return true;
  if (l.startsWith('#')) return true;
  if (/^javascript:/i.test(l)) return true;
  if (l.includes('/api/proxy/image?')) return true;
  return false;
}

function proxyUrl(absolute: string, apiBase: string): string {
  const base = normalizeApiBase(apiBase);
  return `${base}${PROXY_PATH}?url=${encodeURIComponent(absolute)}`;
}

/** Only proxy URLs that are images — never <script src="...js"> (breaks MIME / execution). */
function shouldProxyAsImage(absUrl: string): boolean {
  const raw = absUrl.trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return false;
  let path = raw;
  try {
    const u = new URL(raw);
    path = u.pathname + u.search;
  } catch {
    /* keep raw */
  }
  const lower = path.toLowerCase();
  if (/\.(js|mjs|cjs|css|json|html|htm|map)(\?|#|$)/i.test(lower)) return false;
  if (/\.(woff2?|ttf|eot|otf)(\?|#|$)/i.test(lower)) return false;
  if (/\.(mp4|webm|ogg|mp3|wav)(\?|#|$)/i.test(lower)) return false;
  if (/\.(jpg|jpeg|png|gif|webp|svg|ico|avif|bmp)(\?|#|$)/i.test(lower)) return true;
  if (/\/wp-content\/uploads\//i.test(raw)) return true;
  if (/picsum\.photos/i.test(raw)) return true;
  if (/images\.unsplash\.com\/photo-/i.test(raw)) return true;
  return false;
}

function resolveToAbsolute(href: string, baseHref: string | null): string | null {
  const raw = href.trim();
  if (isSkippableUrl(raw)) return null;
  try {
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('//')) return 'https:' + raw;
    if (baseHref) return new URL(raw, baseHref).href;
  } catch {
    return null;
  }
  return null;
}

function rewriteSrcsetValue(srcset: string, baseHref: string | null, apiBase: string): string {
  return srcset
    .split(',')
    .map((part) => {
      const t = part.trim();
      if (!t) return part;
      const tokens = t.split(/\s+/);
      const urlPart = tokens[0];
      const desc = tokens.length > 1 ? tokens.slice(1).join(' ') : '';
      const abs = resolveToAbsolute(urlPart, baseHref);
      if (!abs || !shouldProxyAsImage(abs)) return part;
      const proxied = proxyUrl(abs, apiBase);
      return desc ? `${proxied} ${desc}` : proxied;
    })
    .join(', ');
}

function rewriteUrlsInCssFragment(css: string, baseHref: string | null, apiBase: string): string {
  return css.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (match, url) => {
    const u = String(url).trim();
    if (u.startsWith('#') || u.startsWith('data:') || u.includes('/api/proxy/image?')) return match;
    const abs = resolveToAbsolute(u, baseHref);
    if (!abs || !shouldProxyAsImage(abs)) return match;
    return `url("${proxyUrl(abs, apiBase)}")`;
  });
}

/** Default backend URL for proxy rewrites when env is unset */
export function getDefaultApiBaseForProxy(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  return normalizeApiBase(fromEnv || 'https://beta-avallon.onrender.com');
}

/**
 * Rewrite external image URLs to Avallon's /api/proxy/image so hotlink / referrer 403s are avoided.
 */
export function rewriteExternalImagesToProxy(html: string, apiBase: string): string {
  if (!html || typeof html !== 'string' || !apiBase) return html;
  const baseHref = extractBaseHref(html);
  let out = html;

  const attrPairs: Array<[string, 'srcset' | 'plain']> = [
    ['srcset', 'srcset'],
    ['data-srcset', 'srcset'],
    ['src', 'plain'],
    ['data-src', 'plain'],
    ['data-lazy-src', 'plain'],
    ['data-large_image', 'plain'],
    ['data-full-url', 'plain'],
    ['poster', 'plain'],
  ];

  for (const [attr, kind] of attrPairs) {
    const re = new RegExp(`(\\b${attr})=(["'])([^"']*)\\2`, 'gi');
    out = out.replace(re, (match, name, quote, val) => {
      if (kind === 'srcset') {
        return `${name}=${quote}${rewriteSrcsetValue(val, baseHref, apiBase)}${quote}`;
      }
      const abs = resolveToAbsolute(val, baseHref);
      if (!abs || !shouldProxyAsImage(abs)) return match;
      return `${name}=${quote}${proxyUrl(abs, apiBase)}${quote}`;
    });
  }

  out = out.replace(/\bstyle=(["'])([^"']*)\1/gi, (m, quote, styleContent) => {
    return `style=${quote}${rewriteUrlsInCssFragment(styleContent, baseHref, apiBase)}${quote}`;
  });

  out = out.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (block, css) => {
    return block.replace(css, rewriteUrlsInCssFragment(css, baseHref, apiBase));
  });

  return out;
}

export function sanitizeWordpressImportedHtml(html: string): string {
  if (!html || typeof html !== 'string') return html;
  let out = html;

  // Minimal window.wp so inline scripts that expect wp.domReady don't throw
  if (!out.includes('data-avallon-wp-stub')) {
    const wpStub = `<script data-avallon-wp-stub="true">window.wp=window.wp||{};window.wp.domReady=function(cb){if(typeof cb!=='function')return;if(document.readyState!=='loading')cb();else document.addEventListener('DOMContentLoaded',cb);};</script>`;
    if (out.includes('</head>')) out = out.replace('</head>', wpStub + '\n</head>');
    else if (out.includes('<head>')) out = out.replace('<head>', '<head>\n' + wpStub);
    else if (out.includes('</body>')) out = out.replace('</body>', wpStub + '\n</body>');
    else out = wpStub + out;
  }

  // Any Swiper JS URL (WordPress plugin paths, old CDNs) → jsDelivr (loads reliably in preview)
  out = out.replace(
    /<script\b([^>]*?)\bsrc=["']([^"']*swiper[^"']*\.js[^"']*)["']([^>]*)>\s*<\/script>/gi,
    (match, pre, src, post) => {
      if (/cdn\.jsdelivr\.net\/npm\/swiper/i.test(src)) return match;
      return `<script${pre}src="${JSD_SWIPER_JS}"${post}></script>`;
    }
  );

  out = out.replace(
    /<link\b([^>]*?)\bhref=["']([^"']*swiper[^"']*\.css[^"']*)["']([^>]*)>/gi,
    (match, pre, href, post) => {
      if (/cdn\.jsdelivr\.net\/npm\/swiper/i.test(href)) return match;
      return `<link${pre}href="${JSD_SWIPER_CSS}"${post}>`;
    }
  );

  // WordPress core / interactivity scripts — 403 when loaded cross-origin from blob/avallon
  out = out.replace(
    /<script\b[^>]*\bsrc=["']https?:\/\/[^"']+\/wp-includes\/[^"']+["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed wp-includes script (cross-origin blocked) -->'
  );
  out = out.replace(
    /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']https?:\/\/[^"']+\/wp-includes\/[^"']+["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed wp-includes module -->'
  );

  // Breeze / similar prefetch plugins (often 403 off-site)
  out = out.replace(
    /<script\b[^>]*\bsrc=["']https?:\/\/[^"']*breeze[^"']*["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed breeze script -->'
  );

  out = out.replace(
    /<script\b[^>]*\bsrc=["']([^"']*wp-content\/plugins\/[^"']+)["'][^>]*>\s*<\/script>/gi,
    (match, src: string) => {
      if (/swiper|cb-carousel|carousel|block-view|interactivity\/index|blocks\/view\.js/i.test(src)) {
        return '<!-- avallon: removed wp plugin script (carousel handled by Avallon) -->';
      }
      return match;
    }
  );

  out = out.replace(/<link[^>]*rel=["']preload["'][^>]*href=["'][^"']*wp-includes[^"']*["'][^>]*>/gi, '');
  out = out.replace(/<link[^>]*rel=["']modulepreload["'][^>]*href=["'][^"']*wp-includes[^"']*["'][^>]*>/gi, '');

  // Dedupe multiple identical jsDelivr Swiper script tags (after rewrites)
  let swiperScriptCount = 0;
  out = out.replace(
    /<script\b[^>]*\bsrc=["']https:\/\/cdn\.jsdelivr\.net\/npm\/swiper@11\/swiper-bundle\.min\.js["'][^>]*>\s*<\/script>/gi,
    (m) => {
      swiperScriptCount++;
      return swiperScriptCount > 1 ? '' : m;
    }
  );

  return out;
}
