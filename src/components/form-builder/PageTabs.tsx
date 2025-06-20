import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { FormPage } from "@/types/form-builder";
import TooltipWrapper from "../TooltipWrapper";

interface PageTabsProps {
  pages: FormPage[];
  activePage: string;
  onChangePage: (pageId: string) => void;
  onAddPage: () => void;
  onRemovePage: (pageId: string) => void;
  onClearAllPage: () => void;
}

const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePage,
  onChangePage,
  onAddPage,
  onRemovePage,
  onClearAllPage,
}) => {
  const handleRemovePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemovePage?.(pageId);
  };
  return (
    <Tabs value={activePage} onValueChange={onChangePage} className="mb-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          {pages?.length > 0 && (
            <TabsList>
              {pages?.map((page) => (
                <TabsTrigger key={page.id} value={page.id}>
                  {page.title}
                  {page.id !== "page-1" && (
                    <div
                      aria-label="Delete current page"
                      className="ml-2 cursor-pointer hover:opacity-50"
                      onClick={(e) => handleRemovePage(page.id, e)}
                    >
                      <X />
                    </div>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>

        <Button onClick={onAddPage} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Page
        </Button>

        <TooltipWrapper content="Remove all form elements">
          <Button
            leftIcon={<X />}
            onClick={onClearAllPage}
            size="sm"
            variant="destructive"
          >
            Clear All
          </Button>
        </TooltipWrapper>
      </div>
    </Tabs>
  );
};

export default PageTabs;
