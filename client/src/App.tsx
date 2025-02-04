import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ElementsPage from "@/pages/elements/index";
import ElementPage from "@/pages/elements/[id]";
import DatabasesPage from "@/pages/settings/databases";
import CategoriesPage from "@/pages/settings/categories";
import OwnerGroupsPage from "@/pages/settings/owner-groups";
import AdminPage from "@/pages/admin";
import { AuthProvider } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/elements" component={ElementsPage} />
          <Route path="/elements/:id" component={ElementPage} />
          <Route path="/settings/databases" component={DatabasesPage} />
          <Route path="/settings/categories" component={CategoriesPage} />
          <Route path="/settings/owner-groups" component={OwnerGroupsPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;