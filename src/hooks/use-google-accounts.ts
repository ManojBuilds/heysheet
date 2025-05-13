"use client";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function useGoogleAccounts() {
  const supabase = createClient();
  const { user } = useUser();
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);

  useEffect(() => {
    const getGoogleAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("google_accounts")
          .select("*")
          .eq("user_id", user?.id);
        if (error) {
          console.log(error);
          toast.error(error.message);
        }
        if (data) {
          setGoogleAccounts(data);
        }
      } catch (error) {
        console.log("Failed to get google accounts:", error);
        toast.error("Failed to get google accounts");
      }
    };
    if (user?.id) {
      getGoogleAccounts();
    }
  }, [user]);

  return { googleAccounts };
}
