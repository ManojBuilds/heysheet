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

  const query = useQuery<SubscriptionData, Error>({
    queryKey: ["subscription", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "plan, status, customer_id, next_billing, billing_interval, subscription_id",
        )
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return data;
      }
      return {
        plan: "free",
        status: "active",
        next_billing: "",
        customer_id: "",
        billing_interval: "monthly",
        subscription_id: "",
      };
    },
  });

  return query;
};

export default useSubscription;
