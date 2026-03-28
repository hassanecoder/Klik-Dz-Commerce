import { Link } from "wouter";
import { useGetFeaturedProducts, useGetCategories } from "@workspace/api-client-react";
import ProductCard from "@/components/product-card";
import { useTranslation } from "@/store/useStore";
import { getLocalizedField } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { t, lang } = useTranslation();
  const { data: featuredProducts, isLoading: isProductsLoading } = useGetFeaturedProducts();
  const { data: categories, isLoading: isCatsLoading } = useGetCategories();

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" dir="ltr" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-start"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 text-accent font-bold text-sm tracking-wider mb-6 border border-accent/20 backdrop-blur-md">
              MALL ALGÉRIE 🇩🇿
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg">
              {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-medium max-w-xl">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 text-lg">
                {t('shop_now')} <ShoppingBag className="w-5 h-5" />
              </Link>
              <Link href="/categories" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold rounded-full transition-all duration-300 text-lg">
                {t('categories')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="bg-card border-b border-border py-8 shadow-sm relative z-20 -mt-8 mx-4 sm:mx-8 rounded-2xl mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border rtl:divide-x-reverse">
            <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">{t('fast_delivery')}</h4>
                <p className="text-sm text-muted-foreground">Livraison 58 wilayas</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">{t('cod')}</h4>
                <p className="text-sm text-muted-foreground">Paiement à la livraison</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">Support 24/7</h4>
                <p className="text-sm text-muted-foreground">Service client réactif</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">{t('categories')}</h2>
              <p className="text-muted-foreground">Explorez notre large gamme de produits</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:underline">
              {t('view_all')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
          
          {isCatsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card rounded-2xl p-6 h-40 animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={`/categories/${cat.id}`}
                    className="group bg-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4 border border-border hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 text-center h-full"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center text-3xl transition-colors">
                      {cat.icon || '📦'}
                    </div>
                    <span className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                      {getLocalizedField(cat, 'name', lang)}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sale Banner Promo */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center">
            <img 
              src={`${import.meta.env.BASE_URL}images/sale-banner.png`} 
              alt="Sale Banner" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" dir="ltr" />
            <div className="relative z-10 p-8 md:p-16 max-w-xl text-start text-white">
              <span className="bg-destructive text-white font-bold px-3 py-1 rounded-full text-sm mb-4 inline-block">
                PROMO FLASH
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
                Jusqu'à -50% sur l'Électroménager
              </h2>
              <p className="text-lg text-white/80 mb-8">Profitez des meilleures offres de la saison. Stocks limités !</p>
              <Link href="/products?categoryId=2" className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-3 rounded-full transition-colors inline-block">
                Découvrir
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 mb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground">{t('featured_products')}</h2>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:underline">
              {t('view_all')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          {isProductsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
