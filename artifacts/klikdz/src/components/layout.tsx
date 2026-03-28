import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore, useTranslation } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { 
  ShoppingCart, Heart, Search, Menu, X, Sun, Moon, 
  ChevronDown, User, Globe, Store, Truck, ShieldCheck
} from "lucide-react";
import { useGetCategories } from "@workspace/api-client-react";
import { getLocalizedField } from "@/lib/utils";

export default function Layout({ children }: { children: ReactNode }) {
  const { t, lang } = useTranslation();
  const { theme, setTheme, lang: currentLang, setLang, cart, favorites } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: categories } = useGetCategories();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-sm font-medium">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> {t('fast_delivery')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="group relative flex items-center gap-1 cursor-pointer">
              <Globe className="w-4 h-4" />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown className="w-3 h-3" />
              <div className="absolute top-full end-0 mt-2 w-32 bg-card text-card-foreground rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden border border-border">
                <button onClick={() => setLang('ar')} className={cn("w-full text-start px-4 py-2 hover:bg-muted transition-colors", currentLang === 'ar' && "font-bold text-primary")}>العربية</button>
                <button onClick={() => setLang('fr')} className={cn("w-full text-start px-4 py-2 hover:bg-muted transition-colors", currentLang === 'fr' && "font-bold text-primary")}>Français</button>
                <button onClick={() => setLang('en')} className={cn("w-full text-start px-4 py-2 hover:bg-muted transition-colors", currentLang === 'en' && "font-bold text-primary")}>English</button>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:text-accent transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 glass w-full border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4 md:gap-8">
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ms-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 outline-none group">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="KlikDz Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-display text-2xl md:text-3xl font-extrabold text-gradient-primary hidden sm:block tracking-tight">
                KlikDz
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 ps-5 pe-14 rounded-full bg-muted/50 border-2 border-transparent focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
              <button 
                type="submit" 
                className="absolute end-2 top-1/2 -translate-y-1/2 w-10 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/signin" className="hidden lg:flex flex-col items-start px-3 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <span className="text-xs text-muted-foreground">{t('sign_in')}</span>
              <span className="text-sm font-semibold flex items-center gap-1">
                <User className="w-4 h-4" /> {t('sign_up')}
              </span>
            </Link>

            <Link href="/favorites" className="relative p-2.5 rounded-xl hover:bg-muted transition-colors text-foreground group">
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform group-hover:text-destructive" />
              {favorites.length > 0 && (
                <span className="absolute top-1 end-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors group flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -end-2 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center rounded-full shadow-sm animate-in zoom-in">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:block font-bold">{t('cart')}</span>
            </Link>
          </div>
        </div>
        
        {/* Desktop Nav Categories */}
        <div className="hidden md:flex border-t border-border/50 bg-background/95">
          <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto no-scrollbar py-2.5">
            <Link href="/categories" className="font-semibold text-primary flex items-center gap-1.5 whitespace-nowrap hover:text-primary/80 transition-colors">
              <Menu className="w-4 h-4" /> {t('all_categories')}
            </Link>
            <div className="h-4 w-px bg-border"></div>
            {categories?.slice(0, 8).map(cat => (
              <Link 
                key={cat.id} 
                href={`/categories/${cat.id}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {getLocalizedField(cat, 'name', lang)}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-start-full duration-300">
            <div className="p-4 flex items-center justify-between border-b">
              <span className="font-display text-xl font-bold text-primary">KlikDz</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b">
              <form onSubmit={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); handleSearch(e); }} className="relative">
                <input 
                  type="text" 
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 ps-4 pe-12 rounded-xl bg-muted border border-transparent focus:border-primary focus:outline-none"
                />
                <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t('categories')}
              </div>
              <div className="flex flex-col">
                {categories?.map(cat => (
                  <Link 
                    key={cat.id} 
                    href={`/categories/${cat.id}`}
                    className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {cat.icon ? <span className="text-sm">{cat.icon}</span> : <Store className="w-4 h-4"/>}
                    </div>
                    {getLocalizedField(cat, 'name', lang)}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t bg-muted/30">
              <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2 font-medium">
                <User className="w-5 h-5 text-muted-foreground" /> {t('sign_in')} / {t('sign_up')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="KlikDz" className="w-10 h-10 object-contain" />
                <span className="font-display text-2xl font-extrabold text-foreground">KlikDz</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('hero_subtitle')}
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"><Store className="w-5 h-5"/></div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"><Globe className="w-5 h-5"/></div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">{t('categories')}</h3>
              <ul className="space-y-3">
                {categories?.slice(0, 5).map(cat => (
                  <li key={cat.id}>
                    <Link href={`/categories/${cat.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {getLocalizedField(cat, 'name', lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">FAQs</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Shipping & Returns</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Track Order</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">{t('payment_methods')}</h3>
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4 text-primary font-bold">
                  <ShieldCheck className="w-6 h-6" /> {t('cod')}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pay securely with cash upon receiving your order. Available across all 58 wilayas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} KlikDz. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
