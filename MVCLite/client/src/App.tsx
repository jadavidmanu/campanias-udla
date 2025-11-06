import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";

// Import pages
import CampaignsPage from "@/pages/Campaigns";
import AdGroupsPage from "@/pages/AdGroups";
import AdsPage from "@/pages/Ads";
import ProgramsPage from "@/pages/Programs";
import SearchPage from "@/pages/Search";
import CompletePage from "@/pages/Complete";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CampaignsPage} />
      <Route path="/grupos" component={AdGroupsPage} />
      <Route path="/anuncios" component={AdsPage} />
      <Route path="/programas" component={ProgramsPage} />
      <Route path="/buscar" component={SearchPage} />
      <Route path="/completo" component={CompletePage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-6 py-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
