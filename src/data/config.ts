const WHATSAPP_COUNTRY_CODE = "2";

export const config = {
  phoneNumber: "01281515233",
  whatsappNumber: "01063053320",
  whatsappCountryCode: WHATSAPP_COUNTRY_CODE,
  address: "الصيادين - الموقف الجديد - أمام عطارة الجمال",
  mapLink: "https://maps.app.goo.gl/xnNX8Yu1RRJjmdHY8",
  email: "hassancoffee.eg@gmail.com",
  deliveryFee: 20,
};

export const getWhatsAppUrl = (number: string, message?: string): string => {
  const base = `https://wa.me/${WHATSAPP_COUNTRY_CODE}${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
