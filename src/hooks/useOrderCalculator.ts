import { useState } from 'react';
import { trackWhatsappClick } from '../utils/analytics';

const whatsappNumber = "01063053320";

export const coffeePrices: Record<string, number> = {
  'بن سادة': 560,
  'بن محوج': 600,
  'بن بالبندق': 700
};

export const quantityPresets = [
  { label: 'ثمن كيلو (0.125 كجم)', value: 0.125 },
  { label: 'ربع كيلو (0.25 كجم)', value: 0.25 },
  { label: 'نصف كيلو (0.5 كجم)', value: 0.5 },
  { label: 'ثلاثة أرباع كيلو (0.75 كجم)', value: 0.75 },
  { label: 'كيلو كامل (1 كجم)', value: 1 }
];

export const deliveryFee = 20;

export function useOrderCalculator() {
  const [coffeeType, setCoffeeType] = useState('بن سادة');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [quantityDropdownOpen, setQuantityDropdownOpen] = useState(false);

  const coffeePriceTotal = coffeePrices[coffeeType] * (Number(quantity) || 0);
  const orderTotal = coffeePriceTotal + (Number(quantity) > 0 ? deliveryFee : 0);

  const handleOrderCalculatorWhatsapp = () => {
    trackWhatsappClick(`حاسبة الطلب - ${coffeeType}`);
    const message = `السلام عليكم،\nأرغب في طلب:\n\nالنوع: ${coffeeType}\nالكمية: ${quantity} كيلو\n\nسعر البن: ${coffeePriceTotal.toFixed(0)} جنيه\nالتوصيل: ${deliveryFee} جنيه\nالإجمالي: ${orderTotal.toFixed(0)} جنيه\n\nيرجى التواصل معي لإتمام الطلب.`;
    window.open(`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return {
    coffeeType,
    setCoffeeType,
    quantity,
    setQuantity,
    quantityDropdownOpen,
    setQuantityDropdownOpen,
    coffeePrices,
    quantityPresets,
    deliveryFee,
    coffeePriceTotal,
    orderTotal,
    handleOrderCalculatorWhatsapp
  };
}
