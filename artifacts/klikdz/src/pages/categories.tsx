import { useGetCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useTranslation } from "@/store/useStore";
import { getLocalizedField } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";

export default function Categories() {
  const { t, lang } = useTranslation();
  const { data: categories, isLoading } = useGetCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">{t('all_categories')}</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Parcourez notre catalogue organisé pour trouver exactement ce que vous cherchez.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-card rounded-3xl h-48 animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map(category => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col"
            >
              <div className="h-32 bg-gradient-to-br from-muted to-muted/30 flex flex-col items-center justify-center p-6 relative">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-500 relative z-10 text-primary">
                  {category.icon || <Package className="w-8 h-8" />}
                </div>
              </div>
              <div className="p-6 bg-card flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {getLocalizedField(category, 'name', lang)}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {getLocalizedField(category, 'description', lang) || "Découvrez nos meilleurs produits de cette catégorie."}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>{category.productCount || 0} Produits</span>
                  <ChevronRight className="w-5 h-5 rtl:rotate-180 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
