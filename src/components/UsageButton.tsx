import { Progress } from "./ui/progress";
import { planLimits } from "@/lib/planLimits";
import { createClient } from "@/lib/supabase/server";
import UpgradeCta from "./UpgradeCta";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/actions";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

const UsageButton = () => {
  return (
    <div className="space-y-2 text-sm">
      <Suspense fallback={<Skeleton className="h-8" />}>
        <UsageData />
      </Suspense>
      <UpgradeCta className="w-full" />
    </div>
  );
};

export default UsageButton;

const UsageData = async () => {
  const { userId } = await auth();
  const subscription = await getSubscription();

  const plan = subscription?.plan || "free";
  const limits = planLimits[plan as keyof typeof planLimits];
  const { forms = 0, submissions = 0 } = await getUsageData({
    userId: userId!,
  });

  const formUsagePercent =
    limits.maxForms === Infinity
      ? 0
      : Math.min((forms / limits.maxForms) * 100, 100);

  const submissionUsagePercent =
    limits.maxSubmissions === Infinity
      ? 0
      : Math.min((submissions / limits.maxSubmissions) * 100, 100);

  return (
    <>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>
            Forms: {forms}/
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
            Submissions this month: {submissions}/
            {limits.maxSubmissions === Infinity ? "∞" : limits.maxSubmissions}
          </span>
        </div>
        {limits.maxSubmissions !== Infinity && (
          <Progress value={submissionUsagePercent} className="h-2" />
        )}
      </div>
    </>
  );
};

async function getUsageData({ userId }: { userId: string }) {
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const [{ count: formCount }, { data: forms }] = await Promise.all([
    supabase
      .from("forms")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId!),
    supabase.from("forms").select("id").eq("user_id", userId!),
  ]);

  const formIds = forms?.map((f) => f.id) ?? [];

  const { count: submissionCount } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .gte("created_at", firstDayOfMonth)
    .in("form_id", formIds);

  return {
    forms: formCount ?? 0,
    submissions: submissionCount ?? 0,
  };
}
