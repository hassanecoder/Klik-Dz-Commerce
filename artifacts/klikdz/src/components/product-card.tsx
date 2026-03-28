import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { useStore, useTranslation } from "@/store/useStore";
import { formatPrice, getLocalizedField, cn } from "@/lib/utils";
import { ShoppingCart, Heart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useTranslation();
  const { addToCart, toggleFavorite, favorites } = useStore();
  const { toast } = useToast();
  
  const isFav = favorites.includes(product.id);
  const name = getLocalizedField(product, 'name', lang);
  const categoryName = getLocalizedField(product, 'categoryName', lang);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative bg-card rounded-2xl border border-border overflow-hidden hover-lift flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-3 start-3 z-10 flex flex-col gap-2">
        {product.discount && (
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{product.discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3" /> Featured
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button 
        onClick={handleFavorite}
        className="absolute top-3 end-3 z-10 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-background shadow-sm transition-all"
      >
        <Heart className={cn("w-5 h-5 transition-transform", isFav && "fill-destructive text-destructive")} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
        {product.image ? (
          <img 
            src={product.image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/60 to-transparent">
          <button 
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.inStock ? t('add_to_cart') : t('out_of_stock')}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">
          {categoryName}
        </span>
        <h3 className="font-bold text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <div className="text-lg font-extrabold text-foreground">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
