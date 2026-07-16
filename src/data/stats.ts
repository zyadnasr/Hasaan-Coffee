import { type LucideIcon, Users, Award, ShoppingBag, StarHalf } from 'lucide-react';

export interface Stat {
  icon: LucideIcon;
  value: number;
  prefix: string;
  suffix: string;
  title: string;
  decimals: number;
}

export const stats: Stat[] = [
  { icon: Users, value: 2000, prefix: "+", title: "عميل سعيد", decimals: 0, suffix: "" },
  { icon: Award, value: 5, prefix: "+", title: "سنوات من الخبرة", decimals: 0, suffix: "" },
  { icon: ShoppingBag, value: 5000, prefix: "+", title: "كيلو بن تم بيعه", decimals: 0, suffix: "" },
  { icon: StarHalf, value: 4.9, decimals: 1, suffix: "/5", title: "متوسط تقييم العملاء", prefix: "" }
];
