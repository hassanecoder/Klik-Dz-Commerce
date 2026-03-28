import { Link, useLocation } from "wouter";
import { useStore, useTranslation } from "@/store/useStore";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const { t, lang } = useTranslation();
  const { cart, updateQuantity, removeFromCart } = useStore();
  const [, setLocation] = useLocation();

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-display font-extrabold mb-4">{t('empty_cart')}</h1>
        <p className="text-xl text-muted-foreground mb-8 text-center max-w-md">
          Ajoutez des produits à votre panier et profitez de la livraison rapide !
        </p>
        <Link href="/products" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all text-lg flex items-center gap-2">
          {t('start_shopping')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-10">{t('cart')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={item.product.id} className="bg-card border border-border rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/products/${item.product.id}`} className="shrink-0">
                <img 
                  src={item.product.image} 
                  alt="" 
                  className="w-full sm:w-32 h-32 object-cover rounded-2xl bg-muted/30 border border-border/50" 
                />
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <Link href={`/products/${item.product.id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                    {getLocalizedField(item.product, 'name', lang)}
                  </Link>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors shrink-0"
                    title={t('remove')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm font-bold text-primary mb-auto bg-primary/10 w-fit px-3 py-1 rounded-full">
                  {getLocalizedField(item.product, 'categoryName', lang)}
                </p>
                
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center bg-muted rounded-full p-1 border border-border">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-2xl font-extrabold">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-3xl p-8 sticky top-28 shadow-xl">
            <h3 className="text-2xl font-display font-bold mb-6 pb-4 border-b border-border">Résumé</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total ({cart.length} articles)</span>
                <span className="font-medium text-foreground">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-md">Calculée à la caisse</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold">{t('total')}</span>
                <span className="text-3xl font-extrabold text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setLocation('/checkout')}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-5 rounded-full shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all"
            >
              {t('checkout')}
            </button>
            <p className="text-center text-sm text-muted-foreground mt-4 flex justify-center items-center gap-1">
              Paiement à la livraison <span className="text-emerald-500 font-bold">100% Sécurisé</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
