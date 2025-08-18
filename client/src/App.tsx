import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProfileSetup from "@/pages/profile-setup";
import Search from "@/pages/search";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import RestaurantDetail from "@/pages/restaurant-detail";
import Profile from "@/pages/profile";
import AdminScoring from "@/pages/admin-scoring";
import AdminImprove from "@/pages/admin-improve";
import AdminPanel from "@/pages/admin-panel";
import ApiStats from "@/pages/api-stats";
import Favorites from "@/pages/favorites";
import AiChat from "@/pages/ai-chat";
import VoiceLimitsTest from "@/pages/VoiceLimitsTest";
import GoogleMapsCost from "@/pages/GoogleMapsCost";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  console.log('[ROUTER] Auth state:', { isAuthenticated, isLoading, user: !!user });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vegan-light-green to-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-vegan-green rounded-2xl mb-4 animate-pulse">
            <i className="fas fa-leaf text-white text-3xl"></i>
          </div>
          <p className="text-neutral-gray font-opensans">Loading VeganMapAI...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/map" component={Landing} />
          <Route path="/admin-scoring" component={AdminScoring} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/profile-setup" component={ProfileSetup} />
          <Route path="/home" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/map" component={Home} />
          <Route path="/test-map">
            {() => { window.location.href = '/map'; return null; }}
          </Route>

          <Route path="/restaurant/:id" component={RestaurantDetail} />
          <Route path="/profile" component={Profile} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/admin-scoring" component={AdminScoring} />
          <Route path="/admin-improve" component={AdminImprove} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/api-stats" component={ApiStats} />
          <Route path="/ai-chat" component={AiChat} />
          <Route path="/voice-limits-test" component={VoiceLimitsTest} />
          <Route path="/google-maps-cost" component={GoogleMapsCost} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
