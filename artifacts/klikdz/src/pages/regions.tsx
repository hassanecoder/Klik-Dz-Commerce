import { useGetRegions } from "@workspace/api-client-react";
import { MapPin, Loader2 } from "lucide-react";

export default function Regions() {
  const { data: regions, isLoading } = useGetRegions();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-foreground">
          Nos Zones de Livraison
        </h1>
        <p className="text-xl text-muted-foreground">
          Nous livrons fièrement sur l'ensemble du territoire national algérien. 
          Découvrez les 58 wilayas couvertes par notre réseau logistique.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {regions?.map(region => (
            <div 
              key={region.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 hover:border-primary hover:shadow-lg transition-all group cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-bold text-sm">
                {region.code}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{region.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {region.cities?.length || 0} communes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
