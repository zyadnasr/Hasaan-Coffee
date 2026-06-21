declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackWhatsappClick = (serviceName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_click', {
      service_name: serviceName,
      click_type: 'card',
      section: 'services'
    });
    window.gtag('event', 'whatsapp_click', {
      source_section: 'services',
      service_name: serviceName
    });
  }
};
