/**
 * Subscription Management Hook
 * 
 * This hook provides functionality for managing user subscriptions,
 * including checking premium status, upgrading to premium, and canceling subscriptions.
 * It uses React Query for data fetching and mutation management.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

/**
 * Subscription Hook
 * 
 * Custom hook that provides subscription-related data and functions.
 * 
 * @returns An object containing subscription state and functions:
 *   - isPremium: Whether the user has a premium subscription
 *   - isLoading: Whether subscription data is being loaded
 *   - subscriptionDetails: Detailed subscription information
 *   - expiresAt: When the subscription expires (if applicable)
 *   - upgradeMutation: Mutation for upgrading to premium
 *   - cancelSubscriptionMutation: Mutation for canceling a subscription
 *   - upgradeToSubscription: Legacy function for upgrading
 *   - cancelSubscription: Legacy function for canceling
 */
export function useSubscription() {
  // Get the current user from auth context
  const { user } = useAuth();
  
  /**
   * Subscription Details Query
   * 
   * Fetches detailed subscription information from the server.
   * Only enabled when a user is logged in.
   */
  const { data: subscriptionDetails, isLoading } = useQuery<{ plan: string, expiresAt: string | null }>({
    queryKey: ["/api/subscription"],
    enabled: !!user, // Only fetch if user is logged in
  });
  
  /**
   * Premium Status
   * 
   * Determines if the user has an active premium subscription.
   * Derived from the user object's subscription field.
   */
  const isPremium = user?.subscription === "premium";
  
  /**
   * Subscription Expiration Date
   * 
   * Converts the expiration date string to a Date object.
   * Returns null if there's no expiration date (e.g., for free tier).
   */
  const expiresAt = subscriptionDetails?.expiresAt ? new Date(subscriptionDetails.expiresAt) : null;
  
  /**
   * Upgrade Subscription Mutation
   * 
   * Handles upgrading a user's subscription to the specified plan.
   * On success, invalidates related queries to refresh subscription data.
   * On error, displays a toast notification.
   */
  const upgradeMutation = useMutation({
    mutationFn: async ({ plan }: { plan: string }) => {
      return await apiRequest("POST", "/api/subscription/upgrade", { plan });
    },
    onSuccess: () => {
      // Refresh subscription and user data after successful upgrade
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  /**
   * Cancel Subscription Mutation
   * 
   * Handles canceling a user's premium subscription.
   * On success, invalidates related queries to refresh subscription data.
   * On error, displays a toast notification.
   */
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscription/cancel", {});
    },
    onSuccess: () => {
      // Refresh subscription and user data after successful cancellation
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  /**
   * Legacy Upgrade Method
   * 
   * Maintained for backward compatibility with older components.
   * Wraps the upgradeMutation for simplified usage.
   * 
   * @param plan - The subscription plan to upgrade to
   */
  const upgradeToSubscription = async (plan: string) => {
    await upgradeMutation.mutateAsync({ plan });
  };
  
  /**
   * Legacy Cancel Method
   * 
   * Maintained for backward compatibility with older components.
   * Wraps the cancelSubscriptionMutation for simplified usage.
   */
  const cancelSubscription = async () => {
    await cancelSubscriptionMutation.mutateAsync();
  };
  
  // Return all subscription-related data and functions
  return {
    isPremium,
    isLoading,
    subscriptionDetails,
    expiresAt,
    upgradeMutation,
    cancelSubscriptionMutation,
    // Legacy methods
    upgradeToSubscription,
    cancelSubscription
  };
}
