import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@workspace/api-client-react';
import { translations } from '../lib/i18n';

export type Language = 'ar' | 'fr' | 'en';
export type Theme = 'light' | 'dark';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppState {
  lang: Language;
  theme: Theme;
  cart: CartItem[];
  favorites: number[];
  
  setLang: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  toggleFavorite: (productId: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      theme: 'light',
      cart: [],
      favorites: [],
      
      setLang: (lang) => {
        set({ lang });
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },
      
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          cart: get().cart.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      toggleFavorite: (productId) => {
        const favs = get().favorites;
        if (favs.includes(productId)) {
          set({ favorites: favs.filter(id => id !== productId) });
        } else {
          set({ favorites: [...favs, productId] });
        }
      },
    }),
    {
      name: 'klikdz-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = state.lang;
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);

export function useTranslation() {
  const lang = useStore(s => s.lang);
  const t = (key: string): string => {
    return translations[lang]?.[key] ?? key;
  };
  return { t, lang };
}
