"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

export function FormTabs({
  defaultTab,
  formAnalytics,
  children,
}: {
  defaultTab: string;
  formAnalytics: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">{children}</TabsContent>
        <TabsContent value="analytics">{formAnalytics}</TabsContent>
      </Tabs>
    </div>
  );
}
