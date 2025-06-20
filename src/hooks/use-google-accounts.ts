"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export default function useGoogleAccounts() {
  const supabase = createClient();
  const { user } = useUser();
  const data = useQuery({
    queryKey: ["google_accounts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_accounts")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
  });
  return data;
}
