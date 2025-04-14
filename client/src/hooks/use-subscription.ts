import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export function useSubscription() {
  const { user } = useAuth();
  
  const { data: subscriptionDetails, isLoading } = useQuery<{ plan: string, expiresAt: string | null }>({
    queryKey: ["/api/subscription"],
    enabled: !!user,
  });
  
  const isPremium = user?.subscription === "premium";
  const expiresAt = subscriptionDetails?.expiresAt ? new Date(subscriptionDetails.expiresAt) : null;
  
  const upgradeMutation = useMutation({
    mutationFn: async ({ plan }: { plan: string }) => {
      return await apiRequest("POST", "/api/subscription/upgrade", { plan });
    },
    onSuccess: () => {
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
  
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/subscription/cancel", {});
    },
    onSuccess: () => {
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
  
  // Legacy methods for backward compatibility
  const upgradeToSubscription = async (plan: string) => {
    await upgradeMutation.mutateAsync({ plan });
  };
  
  const cancelSubscription = async () => {
    await cancelSubscriptionMutation.mutateAsync();
  };
  
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
