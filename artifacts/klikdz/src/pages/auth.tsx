import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "@/store/useStore";
import { UserPlus, LogIn, ArrowLeft } from "lucide-react";

export default function AuthPage({ isSignUp = false }: { isSignUp?: boolean }) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock auth delay
    setTimeout(() => {
      setLoading(false);
      setLocation("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30 relative">
      <Link href="/" className="absolute top-8 start-8 flex items-center gap-2 font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5 rtl:rotate-180" /> Retour
      </Link>
      
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 sm:p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 end-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 start-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-extrabold mb-2">
              {isSignUp ? t('sign_up') : t('sign_in')}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp ? "Créez votre compte pour commencer" : "Heureux de vous revoir !"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold mb-2">Nom Complet</label>
                <input 
                  required type="text" 
                  className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                  placeholder="Mohamed Ali"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold mb-2">Email ou Téléphone</label>
              <input 
                required type="text" dir="ltr"
                className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="05xx / email@..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Mot de passe</label>
              <input 
                required type="password" 
                className="w-full bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? "Chargement..." : (isSignUp ? <><UserPlus className="w-5 h-5"/> S'inscrire</> : <><LogIn className="w-5 h-5"/> Se Connecter</>)}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
            {isSignUp ? "Vous avez déjà un compte ?" : "Nouveau sur KlikDz ?"}
            <Link href={isSignUp ? "/signin" : "/signup"} className="text-primary hover:underline ms-2 font-bold">
              {isSignUp ? t('sign_in') : t('sign_up')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
