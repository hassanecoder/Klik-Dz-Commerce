import { useState } from "react";
import { useRoute } from "wouter";
import { 
  useGetProductById, 
  useGetRelatedProducts, 
  useCreateInstantOrder,
  useGetRegions,
  useGetCitiesByRegion
} from "@workspace/api-client-react";
import { useStore, useTranslation } from "@/store/useStore";
import { formatPrice, getLocalizedField } from "@/lib/utils";
import ProductCard from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, Heart, Star, Check, Truck, ShieldCheck, 
  Minus, Plus, Info, Loader2, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);
  
  const { t, lang } = useTranslation();
  const { addToCart, toggleFavorite, favorites } = useStore();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Queries
  const { data: product, isLoading, isError } = useGetProductById(id);
  const { data: relatedProducts } = useGetRelatedProducts(id);
  
  if (isLoading) {
    return <div className="container mx-auto px-4 py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }
  
  if (isError || !product) {
    return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold">Produit introuvable</h2></div>;
  }

  const isFav = favorites.includes(product.id);
  const name = getLocalizedField(product, 'name', lang);
  const description = getLocalizedField(product, 'description', lang);
  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb could go here */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        
        {/* Images Gallery */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row lg:flex-col gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col lg:flex-row gap-3 overflow-auto no-scrollbar pb-2 sm:pb-0 sm:w-20 lg:w-full shrink-0">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 shrink-0 rounded-xl border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {/* Main Image */}
          <div className="flex-1 bg-muted/20 rounded-3xl overflow-hidden border border-border relative aspect-square flex items-center justify-center">
            {product.discount && (
              <span className="absolute top-4 start-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                -{product.discount}%
              </span>
            )}
            <button 
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-4 end-4 z-10 w-12 h-12 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center hover:text-destructive hover:bg-background shadow-md transition-all"
            >
              <Heart className={`w-6 h-6 transition-transform ${isFav ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            </button>
            <img 
              src={images[selectedImage]} 
              alt={name} 
              className="max-w-full max-h-full object-contain p-4"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {getLocalizedField(product, 'categoryName', lang)}
              </span>
              {product.inStock ? (
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> {t('in_stock')}
                </span>
              ) : (
                <span className="text-sm font-bold text-destructive flex items-center gap-1">
                  <Info className="w-4 h-4" /> {t('out_of_stock')}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4 text-foreground">
              {name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-accent">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${star <= product.rating ? 'fill-current' : 'text-muted stroke-1'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium underline cursor-pointer">
                {product.reviewCount} avis
              </span>
            </div>

            <div className="flex items-end gap-4 bg-muted/30 p-6 rounded-2xl border border-border">
              <div className="text-4xl font-extrabold text-foreground tracking-tight">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-xl text-muted-foreground line-through font-medium mb-1">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">Livraison 58 Wilayas</p>
                <p className="text-xs text-muted-foreground">Rapide et sécurisée</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none mb-1">Paiement à la livraison</p>
                <p className="text-xs text-muted-foreground">Payez en toute sécurité</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-bold">{t('quantity')}:</span>
              <div className="flex items-center bg-muted rounded-full p-1 border border-border">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowOrderModal(true)}
                disabled={!product.inStock}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xl font-bold py-4 rounded-full shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('order_now')} (Livraison)
              </button>
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  toast({ title: "Succès", description: "Ajouté au panier", variant: "default" });
                }}
                disabled={!product.inStock}
                className="sm:w-1/3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" /> {t('add_to_cart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Caractéristiques techniques</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {Object.entries(product.specifications).map(([key, value], idx) => (
              <div key={key} className={`flex p-4 ${idx % 2 === 0 ? 'bg-muted/30' : 'bg-transparent'}`}>
                <span className="w-1/3 font-bold text-muted-foreground capitalize">{key}</span>
                <span className="w-2/3 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-border">
          <h2 className="text-3xl font-display font-bold mb-8">{t('related_products')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Instant Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <InstantOrderModal 
            product={product} 
            quantity={quantity} 
            onClose={() => setShowOrderModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Separate component for Instant Order to manage its own complex state
function InstantOrderModal({ product, quantity, onClose }: { product: any, quantity: number, onClose: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { data: regions } = useGetRegions();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilaya: "",
    city: "",
    address: ""
  });

  // Fetch cities when wilaya changes
  const selectedRegion = regions?.find(r => r.name === formData.wilaya);
  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesByRegion(
    selectedRegion?.code || "", 
    { query: { enabled: !!selectedRegion } }
  );

  const { mutate: submitOrder, isPending } = useCreateInstantOrder({
    mutation: {
      onSuccess: () => {
        toast({
          title: t('order_success'),
          description: "Un de nos agents vous contactera très bientôt.",
          duration: 5000,
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Veuillez vérifier vos informations et réessayer.",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrder({
      data: {
        ...formData,
        productId: product.id,
        quantity: quantity
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 bg-primary text-primary-foreground flex justify-between items-center shrink-0">
          <h3 className="text-2xl font-bold font-display">Confirmation Rapide</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Order Summary */}
          <div className="flex gap-4 p-4 bg-muted/50 rounded-2xl mb-8 border border-border">
            <img src={product.image} alt="" className="w-20 h-20 object-cover rounded-xl bg-white" />
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-bold line-clamp-1">{product.name}</h4>
              <p className="text-sm text-muted-foreground mb-1">Qté: {quantity}</p>
              <p className="font-extrabold text-primary text-lg">{formatPrice(product.price * quantity)}</p>
            </div>
          </div>

          <form id="instant-order-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">{t('full_name')} *</label>
              <input 
                required
                type="text" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="Ex: Mohamed Ali"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">{t('phone')} *</label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="Ex: 05xx xx xx xx"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold mb-2">{t('wilaya')} *</label>
                <select 
                  required
                  value={formData.wilaya}
                  onChange={e => setFormData({...formData, wilaya: e.target.value, city: ""})}
                  className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                >
                  <option value="">Sélectionnez une wilaya</option>
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
                  <option value="">Sélectionnez une commune</option>
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
                placeholder="Avenue, Rue, Bâtiment..."
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 bg-muted/30 border-t border-border mt-auto shrink-0 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-4 font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit"
            form="instant-order-form"
            disabled={isPending}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            Confirmer la Commande
          </button>
        </div>
      </motion.div>
    </div>
  );
}
