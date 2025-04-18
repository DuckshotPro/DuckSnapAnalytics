/**
 * Protected Route Component
 * 
 * This component wraps routes that require authentication.
 * It checks if the user is authenticated and redirects to the auth page if not.
 * It also handles loading states while authentication is being checked.
 */

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

/**
 * Protected Route Component
 * 
 * Wraps a route component to protect it with authentication.
 * 
 * @param path - The URL path for the route
 * @param component - The component to render if authenticated
 * @returns A Route component that handles authentication checks
 */
export function ProtectedRoute({
  path,
  component: Component,
}: {
  /** The URL path this route should match */
  path: string;
  /** The component to render when authenticated */
  component: React.ComponentType;
}) {
  // Get authentication state
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        // Show loading spinner while checking authentication
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }
        
        // Redirect to auth page if not authenticated
        if (!user) {
          return <Redirect to="/auth" />;
        }
        
        // Render the protected component if authenticated
        return <Component />;
      }}
    </Route>
  );
}