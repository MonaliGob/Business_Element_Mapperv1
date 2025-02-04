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
import AuthPage from "@/pages/auth";
import { AuthProvider } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType; path: string }) {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      component={() => (user ? <Component /> : <AuthPage />)}
    />
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user && <Sidebar />}
      <main className={user ? "flex-1" : "w-full"}>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={Home} />
          <ProtectedRoute path="/elements" component={ElementsPage} />
          <ProtectedRoute path="/elements/:id" component={ElementPage} />
          <ProtectedRoute path="/settings/databases" component={DatabasesPage} />
          <ProtectedRoute path="/settings/categories" component={CategoriesPage} />
          <ProtectedRoute path="/settings/owner-groups" component={OwnerGroupsPage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
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