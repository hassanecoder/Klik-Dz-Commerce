import { useState } from "react";
import { useLocation } from "wouter";
import { useGetRegions, useGetCitiesByRegion, useCreateOrder } from "@workspace/api-client-react";
import { useStore, useTranslation } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { t } = useTranslation();
  const { cart, clearCart } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: regions } = useGetRegions();
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilaya: "",
    city: "",
    address: "",
    notes: ""
  });

  const selectedRegion = regions?.find(r => r.name === formData.wilaya);
  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesByRegion(
    selectedRegion?.code || "", 
    { query: { enabled: !!selectedRegion } }
  );

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: () => {
        toast({ title: "Erreur", description: "Veuillez vérifier vos informations.", variant: "destructive" });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    createOrder({
      data: {
        ...formData,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name
        }))
      }
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (success) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-12 text-center max-w-2xl w-full shadow-2xl"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-display font-extrabold mb-4">{t('order_success')}</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Merci pour votre confiance. Notre équipe vous contactera sous 24h pour confirmer l'expédition.
          </p>
          <button 
            onClick={() => setLocation('/')}
            className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors text-lg"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    setLocation('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-10">{t('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-border">Informations de Livraison</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">{t('full_name')} *</label>
                  <input 
                    required type="text" 
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">{t('phone')} *</label>
                  <input 
                    required type="tel" dir="ltr"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="05 / 06 / 07..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">{t('wilaya')} *</label>
                  <select 
                    required
                    value={formData.wilaya}
                    onChange={e => setFormData({...formData, wilaya: e.target.value, city: ""})}
                    className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                  >
                    <option value="">Sélectionnez...</option>
                    {regions?.map(w => (
                      <option key={w.id} value={w.name}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">{t('city')} *</label>
                  <select 
                    required
                    disabled={!formData.wilaya || isCitiesLoading}
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Sélectionnez...</option>
                    {cities?.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">{t('address')}</label>
                <textarea 
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">{t('notes')}</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all resize-none"
                  placeholder="Instructions pour le livreur..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-3xl p-8 sticky top-28 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-border">Votre Commande</h3>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-sm shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-y border-border py-4 mb-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">Sera calculé</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold">{t('total')}</span>
              <span className="text-3xl font-extrabold text-primary">{formatPrice(total)}</span>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-8 border border-border flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm mb-1">Paiement à la Livraison</p>
                <p className="text-xs text-muted-foreground">Vous ne payez que lorsque vous recevez votre commande en main propre.</p>
              </div>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isPending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-5 rounded-full shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-6 h-6 animate-spin" />}
              {t('submit_order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
