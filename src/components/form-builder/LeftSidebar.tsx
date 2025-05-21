import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type SidebarProps = {};

const LeftSidebar = ({}: SidebarProps) => {
  return (
    <aside className="p-4">
      <Tabs defaultValue="components" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="components" className="w-1/2">
            Form Components
          </TabsTrigger>
          <TabsTrigger value="theme" className="w-1/2">
            Theme
          </TabsTrigger>
        </TabsList>
        <TabsContent value="components">
          {/* Replace with your form components list */}
          <div>Form Components content goes here</div>
        </TabsContent>
        <TabsContent value="theme">
          {/* Replace with your theme settings */}
          <div>Theme settings content goes here</div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default LeftSidebar;