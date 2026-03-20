/**
 * HTML utilities for fixing carousel/slider sections in generated websites.
 * Injects Swiper CDN and init script when team/expert/testimonial carousels are detected
 * but lack working JavaScript.
 */

import {
  sanitizeWordpressImportedHtml,
  hasJsdelivrSwiperScript,
  rewriteExternalImagesToProxy,
  getDefaultApiBaseForProxy,
} from './html-wordpress-import';

const SWIPER_CSS =
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">';
/** Overrides common AI mistake: min-width:100% on slides breaks slidesPerView > 1 */
const SWIPER_SLIDE_FIX =
  '<style data-avallon-swiper-fix="1">.swiper .swiper-slide,.swiper-container .swiper-slide,[class*="cb-carousel"] .swiper-slide{min-width:0!important;box-sizing:border-box}</style>';
const SWIPER_SCRIPT =
  '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>';

const CAROUSEL_INIT_SCRIPT = `
<script data-avallon-carousel-init="true">
(function() {
  function wpCarouselScope(swiperRoot) {
    return swiperRoot.closest('[class*="cb-carousel"], [class*="wp-block-cb-carousel"], [class*="wp-block-cb"]') || swiperRoot.parentElement || document.body;
  }
  function mountSwipers() {
    if (typeof Swiper === 'undefined') return;
    var opts = { slidesPerView: 1, spaceBetween: 16, loop: false, rewind: true, speed: 650, grabCursor: true, watchOverflow: true, effect: 'slide', observer: true, observeParents: true, resizeObserver: true, keyboard: { enabled: true }, breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } } };
    document.querySelectorAll('.swiper-wrapper').forEach(function(wrap) {
      var root = wrap.parentElement;
      if (!root || root.dataset.avallonInited === 'true') return;
      if (!wrap.querySelector('.swiper-slide')) return;
      var scope = wpCarouselScope(root);
      try {
        if (root.swiper && root.swiper.destroy) { root.swiper.destroy(true, true); }
      } catch (e) {}
      try {
        var pag = scope.querySelector('.swiper-pagination, .cb-pagination, [class*="cb-pagination"]');
        var prev = scope.querySelector('.swiper-button-prev, .cb-button-prev, [class*="cb-button-prev"]');
        var next = scope.querySelector('.swiper-button-next, .cb-button-next, [class*="cb-button-next"]');
        new Swiper(root, Object.assign({}, opts, {
          pagination: pag ? { el: pag, clickable: true, dynamicBullets: false } : false,
          navigation: (prev && next) ? { nextEl: next, prevEl: prev } : false,
        }));
        root.dataset.avallonInited = 'true';
      } catch (e) { console.warn('Avallon swiper init:', e); }
    });
    document.querySelectorAll('.avallon-carousel-container').forEach(function(container) {
      if (container.dataset.avallonInited === 'true') return;
      var wrapper = container.querySelector('.avallon-carousel-wrapper');
      var prev = container.querySelector('.avallon-carousel-prev');
      var next = container.querySelector('.avallon-carousel-next');
      var pagination = container.querySelector('.avallon-carousel-pagination');
      if (wrapper) {
        try {
          new Swiper(container, Object.assign({}, opts, {
            pagination: pagination ? { el: pagination, clickable: true } : false,
            navigation: (prev && next) ? { nextEl: next, prevEl: prev } : false
          }));
          container.dataset.avallonInited = 'true';
        } catch (e) { console.warn('Avallon carousel init:', e); }
      }
    });
  }
  function initCarousels() {
    mountSwipers();
    requestAnimationFrame(mountSwipers);
    setTimeout(mountSwipers, 0);
    setTimeout(mountSwipers, 400);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
  window.addEventListener('load', function() { mountSwipers(); setTimeout(mountSwipers, 200); });
})();
</script>`;

/**
 * Detect if HTML has carousel-like sections (team, expert, testimonial) with arrows/dots but no working init.
 */
function stripInlineSwiperInitScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (block) => {
    return /\bnew\s+Swiper\s*\(/i.test(block) ? '' : block;
  });
}

function hasSwiperCarouselMarkup(html: string): boolean {
  const l = html.toLowerCase();
  return (
    /\bswiper-wrapper\b/.test(l) ||
    /\bswiper-slide\b/.test(l) ||
    /class=["'][^"']*\bswiper\b[^"']*["']/.test(l) ||
    /class=["'][^"']*\bswiper-container\b[^"']*["']/.test(l) ||
    /\bwp-block-[^"'\s]*carousel\b/.test(l) ||
    /\bcb-carousel\b/.test(l) ||
    /class=["'][^"']*mentor[^"']*["']/.test(l)
  );
}

function needsCarouselFix(html: string): boolean {
  if (!html || typeof html !== 'string') return false;
  const lower = html.toLowerCase();

  const hasCarouselSection =
    /class=["'][^"']*(?:expert|team|testimonial|member|carousel|swiper|mentor)[^"']*["']/.test(lower) ||
    /id=["'][^"']*(?:expert|team|testimonial|mentor)[^"']*["']/.test(lower) ||
    /meet\s+(some\s+of\s+)?our\s+(experts|team)/i.test(html) ||
    /\bmentors?\b/.test(lower) ||
    /learn\s+from\s+founders/i.test(html);

  const hasArrows =
    /swiper-button-(prev|next)|carousel-(prev|next)|[<>][^<]*chevron|arrow-[^"'\s]*|data-(prev|next)/i.test(html) ||
    /<button[^>]*>[\s]*[<>][\s]*<\/button>/i.test(html);

  const hasDots =
    /swiper-pagination|carousel-pagination|pagination|dot\s*<\/|\.pagination|data-slide/i.test(html);

  return !!(hasCarouselSection && (hasArrows || hasDots));
}

/**
 * Transform carousel-like sections into Avallon-initializable structure and inject Swiper + init.
 * Uses markup patterns that work with our init script.
 * @param skipImageProxy — set true for Vercel deploy (keep real URLs for download step; no editor proxy)
 */
function injectCarouselIntoHtml(html: string, options?: { skipImageProxy?: boolean }): string {
  if (!html || typeof html !== 'string') return html;

  let out = sanitizeWordpressImportedHtml(html);
  if (!options?.skipImageProxy) {
    out = rewriteExternalImagesToProxy(out, getDefaultApiBaseForProxy());
  }
  out = stripInlineSwiperInitScripts(out);
  if (!hasSwiperCarouselMarkup(out) && !needsCarouselFix(out)) return out;

  if (hasJsdelivrSwiperScript(out) && out.includes('data-avallon-carousel-init')) return out;

  if (!out.includes('swiper-bundle.min.css')) {
    if (out.includes('</head>')) {
      out = out.replace('</head>', SWIPER_CSS + '\n</head>');
    } else if (out.includes('<head>')) {
      out = out.replace('<head>', '<head>\n' + SWIPER_CSS);
    }
  }

  if (!out.includes('data-avallon-swiper-fix')) {
    if (out.includes('</head>')) {
      out = out.replace('</head>', SWIPER_SLIDE_FIX + '\n</head>');
    } else if (out.includes('<head>')) {
      out = out.replace('<head>', '<head>\n' + SWIPER_SLIDE_FIX);
    } else if (out.includes('</body>')) {
      out = out.replace('</body>', SWIPER_SLIDE_FIX + '\n</body>');
    } else {
      out = SWIPER_SLIDE_FIX + out;
    }
  }

  if (!hasJsdelivrSwiperScript(out)) {
    if (out.includes('</body>')) {
      out = out.replace('</body>', SWIPER_SCRIPT + '\n</body>');
    } else if (out.includes('</html>')) {
      out = out.replace('</html>', SWIPER_SCRIPT + '\n</html>');
    } else {
      out = out + SWIPER_SCRIPT;
    }
  }

  const hasInit = out.includes('data-avallon-carousel-init');
  if (!hasInit) {
    if (out.includes('</body>')) {
      out = out.replace('</body>', CAROUSEL_INIT_SCRIPT + '\n</body>');
    } else if (out.includes('</html>')) {
      out = out.replace('</html>', CAROUSEL_INIT_SCRIPT + '\n</html>');
    } else {
      out = out + CAROUSEL_INIT_SCRIPT;
    }
  }

  return out;
}

/**
 * Same as injectCarouselIntoHtml but does not rewrite images to /api/proxy — used when publishing to Vercel.
 */
export function injectCarouselIntoHtmlForDeploy(html: string): string {
  return injectCarouselIntoHtml(html, { skipImageProxy: true });
}

/**
 * Fix carousel/slider sections across all HTML files in websiteContent.
 */
export function fixCarouselsInWebsiteContent(
  content: Record<string, string> | null | undefined
): Record<string, string> {
  if (!content || typeof content !== 'object') return content || {};

  const fixed: Record<string, string> = {};
  for (const [key, value] of Object.entries(content)) {
    if (key.endsWith('.html') && typeof value === 'string') {
      fixed[key] = injectCarouselIntoHtml(value);
    } else {
      fixed[key] = value;
    }
  }
  return fixed;
}
