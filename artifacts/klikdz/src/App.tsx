import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/layout";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Categories from "@/pages/categories";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Regions from "@/pages/regions";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/signin">
        <AuthPage isSignUp={false} />
      </Route>
      <Route path="/signup">
        <AuthPage isSignUp={true} />
      </Route>
      
      {/* Wrapped in Layout */}
      <Route path="*">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:id" component={ProductDetail} />
            <Route path="/categories" component={Categories} />
            <Route path="/categories/:id">
              {/* Reuse products page with pre-set category via route or query handling - simplified approach */}
              {() => {
                // simple redirect mapping for demonstration, normally would handle internally in Products component
                window.location.href = `${import.meta.env.BASE_URL}products?categoryId=${window.location.pathname.split('/').pop()}`;
                return null;
              }}
            </Route>
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/regions" component={Regions} />
            <Route path="/favorites">
              {() => (
                <div className="container mx-auto px-4 py-20 text-center">
                  <h1 className="text-3xl font-bold mb-4">Mes Favoris</h1>
                  <p className="text-muted-foreground">Vos produits préférés apparaîtront ici.</p>
                </div>
              )}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
