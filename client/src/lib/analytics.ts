declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const gaInit = (): void => {
  const gaId = import.meta.env.VITE_GA4_ID;
  
  if (!gaId) {
    console.warn('[GA4] No measurement ID provided');
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    send_page_view: true,
    anonymize_ip: true
  });

  console.log(`[GA4] Initialized with ID: ${gaId}`);
};

export const gaEvent = (eventName: string, parameters?: Record<string, any>): void => {
  if (typeof window.gtag !== 'function') {
    console.warn('[GA4] gtag not initialized');
    return;
  }

  window.gtag('event', eventName, parameters);
  console.log(`[GA4] Event: ${eventName}`, parameters);
};

// Common events
export const gaPageView = (pagePath: string): void => {
  gaEvent('page_view', {
    page_path: pagePath
  });
};

export const gaSearch = (searchTerm: string): void => {
  gaEvent('search', {
    search_term: searchTerm
  });
};

export const gaSelectContent = (contentType: string, itemId: string): void => {
  gaEvent('select_content', {
    content_type: contentType,
    item_id: itemId
  });
};