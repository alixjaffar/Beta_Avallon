/**
 * Mirror of backend/src/lib/html-wordpress-import.ts — keep in sync.
 * WordPress imports: rewrite Swiper to jsDelivr, stub wp.domReady, strip blocked wp-includes scripts.
 */

const JSD_SWIPER_JS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
const JSD_SWIPER_CSS = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';

export function hasJsdelivrSwiperScript(html: string): boolean {
  return /cdn\.jsdelivr\.net\/npm\/swiper[^"']*swiper-bundle[^"']*\.js/i.test(html);
}

export function sanitizeWordpressImportedHtml(html: string): string {
  if (!html || typeof html !== 'string') return html;
  let out = html;

  if (!out.includes('data-avallon-wp-stub')) {
    const wpStub = `<script data-avallon-wp-stub="true">window.wp=window.wp||{};window.wp.domReady=function(cb){if(typeof cb!=='function')return;if(document.readyState!=='loading')cb();else document.addEventListener('DOMContentLoaded',cb);};</script>`;
    if (out.includes('</head>')) out = out.replace('</head>', wpStub + '\n</head>');
    else if (out.includes('<head>')) out = out.replace('<head>', '<head>\n' + wpStub);
    else if (out.includes('</body>')) out = out.replace('</body>', wpStub + '\n</body>');
    else out = wpStub + out;
  }

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

  out = out.replace(
    /<script\b[^>]*\bsrc=["']https?:\/\/[^"']+\/wp-includes\/[^"']+["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed wp-includes script (cross-origin blocked) -->'
  );
  out = out.replace(
    /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']https?:\/\/[^"']+\/wp-includes\/[^"']+["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed wp-includes module -->'
  );

  out = out.replace(
    /<script\b[^>]*\bsrc=["']https?:\/\/[^"']*breeze[^"']*["'][^>]*>\s*<\/script>/gi,
    '<!-- avallon: removed breeze script -->'
  );

  out = out.replace(/<link[^>]*rel=["']preload["'][^>]*href=["'][^"']*wp-includes[^"']*["'][^>]*>/gi, '');
  out = out.replace(/<link[^>]*rel=["']modulepreload["'][^>]*href=["'][^"']*wp-includes[^"']*["'][^>]*>/gi, '');

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
