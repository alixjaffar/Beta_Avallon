// Firebase Analytics Helper
// Use this file to track events throughout your application
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

/**
 * Track a button click event
 * @param buttonName - Name of the button that was clicked
 * @param page - Page where the button was clicked
 */
export function trackButtonClick(buttonName: string, page?: string) {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'button_click', {
      button_name: buttonName,
      page: page || window.location.pathname,
    });
  } catch (error) {
    console.warn('Failed to track button click:', error);
  }
}

/**
 * Track a purchase event
 * @param amount - Purchase amount
 * @param currency - Currency code (default: 'USD')
 * @param items - Optional array of purchased items
 */
export function trackPurchase(amount: number, currency: string = 'USD', items?: Array<{ id: string; name: string; quantity: number; price: number }>) {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'purchase', {
      currency,
      value: amount,
      ...(items && { items }),
    });
  } catch (error) {
    console.warn('Failed to track purchase:', error);
  }
}

/**
 * Track a page view
 * @param pageName - Name of the page
 * @param pagePath - Path of the page (default: window.location.pathname)
 */
export function trackPageView(pageName: string, pagePath?: string) {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: pagePath || window.location.href,
      page_path: pagePath || window.location.pathname,
    });
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
}

/**
 * Track a sign up event
 * @param method - Sign up method ('email', 'google', 'github')
 */
export function trackSignUp(method: string = 'email') {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'sign_up', {
      method,
    });
  } catch (error) {
    console.warn('Failed to track sign up:', error);
  }
}

/**
 * Track a login event
 * @param method - Login method ('email', 'google', 'github')
 */
export function trackLogin(method: string = 'email') {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'login', {
      method,
    });
  } catch (error) {
    console.warn('Failed to track login:', error);
  }
}

/**
 * Track website generation
 * @param siteId - ID of the generated site
 * @param siteName - Name of the generated site
 */
export function trackWebsiteGeneration(siteId: string, siteName: string) {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, 'generate_content', {
      content_type: 'website',
      content_id: siteId,
      content_name: siteName,
    });
  } catch (error) {
    console.warn('Failed to track website generation:', error);
  }
}

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param eventParams - Parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (!analytics) {
    console.warn('Analytics not available (might be blocked by ad blocker)');
    return;
  }
  
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.warn(`Failed to track event ${eventName}:`, error);
  }
}

// Example usage:
// 
// import { trackButtonClick, trackPurchase, trackSignUp, trackLogin, trackWebsiteGeneration } from '@/lib/analytics';
//
// // Track a button click
// function handleButtonClick() {
//   trackButtonClick('sign_up', 'homepage');
// }
//
// // Track a purchase
// function handlePurchase(amount: number) {
//   trackPurchase(amount, 'USD');
// }
//
// // Track sign up
// function handleSignUp(method: string) {
//   trackSignUp(method);
// }
//
// // Track login
// function handleLogin(method: string) {
//   trackLogin(method);
// }
//
// // Track website generation
// function handleWebsiteGenerated(siteId: string, siteName: string) {
//   trackWebsiteGeneration(siteId, siteName);
// }
