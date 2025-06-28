"use client";

import useSubscription from "@/hooks/useSubscription";
import { Progress } from "./ui/progress";
import { planLimits } from "@/lib/planLimits";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";
import UpgradeCta from "./UpgradeCta";

const UsageButton = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const { data: subscription, isLoading: loadingSub } = useSubscription();

  const plan = subscription?.plan || "free";
  const limits = planLimits[plan as keyof typeof planLimits];

  const { data: usageData, isLoading: loadingUsage } = useQuery({
    queryKey: ["usage", userId],
    enabled: !!userId,
    queryFn: async () => {
      const now = new Date();
      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ).toISOString();

      // Count forms
      const { count: formCount } = await supabase
        .from("forms")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId!);

      // Get form IDs
      const formIds =
        (
          await supabase.from("forms").select("id").eq("user_id", userId!)
        ).data?.map((f) => f.id) ?? [];

      // Count submissions for those forms
      const { count: submissionCount } = await supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth)
        .in("form_id", formIds);

      return {
        forms: formCount ?? 0,
        submissions: submissionCount ?? 0,
      };
    },
  });

  const isLoading = loadingUsage || loadingSub;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div>
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="h-2 w-full rounded" />
        </div>
        <div>
          <Skeleton className="w-48 h-4 mb-2" />
          <Skeleton className="h-2 w-full rounded" />
        </div>
        <Skeleton className="w-32 h-8 mt-4" />
      </div>
    );
  }

  if (!subscription || !usageData) return null;

  const formUsagePercent =
    limits.maxForms === Infinity
      ? 0
      : Math.min((usageData.forms / limits.maxForms) * 100, 100);

  const submissionUsagePercent =
    limits.maxSubmissions === Infinity
      ? 0
      : Math.min((usageData.submissions / limits.maxSubmissions) * 100, 100);

  return (
    <div className="space-y-2 text-sm">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>
            Forms: {usageData.forms}/
            {limits.maxForms === Infinity ? "∞" : limits.maxForms}
          </span>
        </div>
        {limits.maxForms !== Infinity && (
          <Progress value={formUsagePercent} className="h-2" />
        )}
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>
            Submissions this month: {usageData.submissions}/
            {limits.maxSubmissions === Infinity ? "∞" : limits.maxSubmissions}
          </span>
        </div>
        {limits.maxSubmissions !== Infinity && (
          <Progress value={submissionUsagePercent} className="h-2" />
        )}
      </div>
      <UpgradeCta className="w-full" />
    </div>
  );
};

export default UsageButton;
