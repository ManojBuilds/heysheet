"use client";

import { useAuth } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

type SubscriptionData = {
  plan: string;
  status: string;
  current_period_end: string;
  paddle_id: string; 
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
        .select("plan, status, current_period_end, paddle_id")
        .eq("clerk_user_id", userId)
        .single()
      if (error) throw error;
      return data
    },
  });

  return query;
};

export default useSubscription;
