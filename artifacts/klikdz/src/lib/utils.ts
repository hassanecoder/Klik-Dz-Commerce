import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number) {
  // Using explicit formatting for Algerian Dinar (DZD)
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("DZD", "DZD");
}

export function getLocalizedField(item: any, field: string, lang: 'ar' | 'fr' | 'en'): string {
  if (!item) return "";
  if (lang === 'ar' && item[`${field}Ar`]) return item[`${field}Ar`];
  if (lang === 'fr' && item[`${field}Fr`]) return item[`${field}Fr`];
  return item[field] || "";
}
