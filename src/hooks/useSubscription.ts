"use client";

import { useAuth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SubscriptionData = {
  plan: string;
  status: string;
  next_billing: string;
  customer_id: string;
  billing_interval: "monthly" | "annually";
  subscription_id: string;
};

const useSubscription = () => {
  const { userId } = useAuth();
  const supabase = createClient();

  const query = useQuery<SubscriptionData | null, Error>({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "plan, status, customer_id, next_billing, billing_interval, subscription_id",
        )
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  return query;
};

export default useSubscription;
