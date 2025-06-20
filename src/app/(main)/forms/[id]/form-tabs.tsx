"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormDetails } from "./form-details";
import { FormAnalytics } from "./form-analytics";
import { FormDetails as IFormDetails } from "@/types/form-details";

export function FormTabs({
  defaultTab,
  data,
  appUrl,
  endpointUrl,
  id,
  analytics,
}: {
  defaultTab: string;
  data: IFormDetails;
  appUrl: string;
  endpointUrl: string;
  id: string;
  analytics: any;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        <TabsTrigger value="details">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <FormDetails
          data={data}
          appUrl={appUrl}
          endpointUrl={endpointUrl}
          id={id}
        />
      </TabsContent>
      <TabsContent value="analytics">
        <FormAnalytics data={analytics} />
      </TabsContent>
    </Tabs>
  );
}
