import { Suspense } from "react";
import { IntegrationsList } from "./integrations-list";
import { IntegrationsListSkeleton } from "./integrations-list-skeleton";

export const metadata = {
  title: "Integrations - Heysheet",
  description:
    "Connect your Google Sheets and Slack to receive form submissions.",
};

export default async function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Integrations</h1>
      <p className="text-muted-foreground">
        Connect your Google Sheets to receive form submissions
      </p>
      <Suspense fallback={<IntegrationsListSkeleton />}>
        <IntegrationsList />
      </Suspense>
    </div>
  );
}
