import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGetProducts, useGetCategories, GetProductsSortBy } from "@workspace/api-client-react";
import ProductCard from "@/components/product-card";
import { useTranslation } from "@/store/useStore";
import { getLocalizedField } from "@/lib/utils";
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react";

export default function Products() {
  const { t, lang } = useTranslation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  
  const [categoryId, setCategoryId] = useState<number | undefined>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  );
  const [search, setSearch] = useState<string | undefined>(searchParams.get('search') || undefined);
  const [sortBy, setSortBy] = useState<GetProductsSortBy>(GetProductsSortBy.newest);
  const [inStock, setInStock] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data: categories } = useGetCategories();
  
  const { data, isLoading } = useGetProducts({
    categoryId,
    search,
    sortBy,
    inStock: inStock ? true : undefined,
    limit: 20
  });

  const clearFilters = () => {
    setCategoryId(undefined);
    setSearch(undefined);
    setInStock(false);
    setSortBy(GetProductsSortBy.newest);
  };

  const hasFilters = categoryId || search || inStock;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{t('products')}</h1>
        {search && (
          <p className="text-muted-foreground">
            Résultats pour <span className="font-bold text-foreground">"{search}"</span>
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filters Toggle */}
        <button 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden flex items-center justify-between w-full bg-card border border-border rounded-xl p-4 font-bold shadow-sm"
        >
          <span className="flex items-center gap-2"><Filter className="w-5 h-5" /> {t('filter')}</span>
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Sidebar Filters */}
        <aside className={`lg:w-1/4 xl:w-1/5 shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-28 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" /> {t('filter')}
              </h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-destructive hover:underline font-bold">
                  Effacer
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="mb-8">
              <h4 className="font-bold mb-4">{t('categories')}</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={categoryId === undefined}
                      onChange={() => setCategoryId(undefined)}
                      className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none checked:border-primary checked:bg-primary transition-all"
                    />
                  </div>
                  <span className={`text-sm group-hover:text-primary transition-colors ${categoryId === undefined ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                    {t('all_categories')}
                  </span>
                </label>
                {categories?.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={categoryId === cat.id}
                        onChange={() => setCategoryId(cat.id)}
                        className="w-5 h-5 border-2 border-muted-foreground rounded-full appearance-none checked:border-primary checked:bg-primary transition-all"
                      />
                    </div>
                    <span className={`text-sm group-hover:text-primary transition-colors ${categoryId === cat.id ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                      {getLocalizedField(cat, 'name', lang)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-8">
              <h4 className="font-bold mb-4">Disponibilité</h4>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">{t('in_stock')}</span>
                <input 
                  type="checkbox" 
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-11 h-6 bg-muted rounded-full appearance-none relative checked:bg-primary transition-colors before:content-[''] before:absolute before:top-1 before:start-1 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-transform checked:before:translate-x-5"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-card border border-border rounded-2xl p-4 mb-6 gap-4 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">
              <span className="font-bold text-foreground">{data?.total || 0}</span> {t('products')}
            </p>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">{t('sort_by')}:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as GetProductsSortBy)}
                className="w-full sm:w-48 bg-muted border-none text-sm font-bold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              >
                <option value={GetProductsSortBy.newest}>{t('newest')}</option>
                <option value={GetProductsSortBy.popular}>{t('popular')}</option>
                <option value={GetProductsSortBy.price_asc}>{t('price_asc')}</option>
                <option value={GetProductsSortBy.price_desc}>{t('price_desc')}</option>
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                  Recherche: {search}
                  <button onClick={() => setSearch(undefined)} className="hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                </span>
              )}
              {categoryId && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                  Catégorie: {categories?.find(c => c.id === categoryId)?.name || categoryId}
                  <button onClick={() => setCategoryId(undefined)} className="hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                </span>
              )}
              {inStock && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                  En Stock uniquement
                  <button onClick={() => setInStock(false)} className="hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3"/></button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border" />
              ))}
            </div>
          ) : data?.products.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Essayez de modifier vos filtres ou de rechercher autre chose.</p>
              <button onClick={clearFilters} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors">
                Effacer tous les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
