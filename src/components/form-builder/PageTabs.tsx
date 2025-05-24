
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";
import { FormPage } from "@/types/form-builder";

interface PageTabsProps {
  pages: FormPage[];
  activePage: string;
  onChangePage: (pageId: string) => void;
  onAddPage: () => void;
  onRemovePage: (pageId: string)=>void;
}

const PageTabs: React.FC<PageTabsProps> = ({
  pages,
  activePage,
  onChangePage,
  onAddPage,
  onRemovePage
}) => {
  const handleRemovePage = (pageId: string, e: React.MouseEvent)=>{
    e.stopPropagation()
    if(pages.length===1) return
    onRemovePage?.(pageId)
  }
  return (
    <Tabs value={activePage} onValueChange={onChangePage} className="mb-4">
      <div className="flex items-center justify-between">
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page.id} value={page.id} >
              {page.title}
              {
                pages.length > 1 &&(<div aria-label="Delete current page" className="ml-2 cursor-pointer hover:opacity-50" onClick={(e)=>handleRemovePage(page.id, e)} ><X/></div>)
              }
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