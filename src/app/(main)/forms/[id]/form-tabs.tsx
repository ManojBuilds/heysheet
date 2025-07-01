"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FormDetails } from "./form-details";
import { FormDetails as IFormDetails } from "@/types/form-details";
import { ReactNode } from "react";

export function FormTabs({
  defaultTab,
  data,
  appUrl,
  endpointUrl,
  id,
  formAnalytics,
}: {
  defaultTab: string;
  data: IFormDetails;
  appUrl: string;
  endpointUrl: string;
  id: string;
  formAnalytics: ReactNode;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <FormDetails
          data={data}
          appUrl={appUrl}
          endpointUrl={endpointUrl}
          id={id}
        />
      </TabsContent>
      <TabsContent value="analytics">{formAnalytics}</TabsContent>
    </Tabs>
  );
}
