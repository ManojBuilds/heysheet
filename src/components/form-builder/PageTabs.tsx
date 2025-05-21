
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { FormPage } from "@/types/form-builder";

interface PageTabsProps {
  pages: FormPage[];
  activePage: string;
  onChangePage: (pageId: string) => void;
  onAddPage: () => void;
}

const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePage,
  onChangePage,
  onAddPage,
}) => {
  return (
    <Tabs value={activePage} onValueChange={onChangePage} className="mb-4">
      <div className="flex items-center justify-between">
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page.id} value={page.id}>
              {page.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button onClick={onAddPage} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Page
        </Button>
      </div>
    </Tabs>
  );
};

export default PageTabs;