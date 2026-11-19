declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();
const VALID_GA_ID_PATTERN = /^G-[A-Z0-9]+$/i;

let analyticsInitialized = false;

export function initAnalytics(): void {
  if (analyticsInitialized || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  if (!VALID_GA_ID_PATTERN.test(GA_MEASUREMENT_ID)) {
    return;
  }

  analyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

export function trackAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!analyticsInitialized || typeof window === 'undefined' || !window.gtag) {
    return;
  }
  window.gtag('event', eventName, params ?? {});
}
