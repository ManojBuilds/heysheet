import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";
import { PageSearchableList } from "./PageSearchableList";
import { NOTION_DATABASE_TEMPLATES } from "@/lib/notion-database-templates";

interface NotionDatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoadingPages: boolean;
  pages: any[];
  selectedPageId: string | null;
  setSelectedPageId: (id: string) => void;
  newDbName: string;
  setNewDbName: (name: string) => void;
  isCreatingDatabase: boolean;
  createDatabase: () => void;
  setOpenCreatePageDialog: (open: boolean) => void;
  newDbTemplate: string;
  setNewDbTemplate: (template: string) => void;
}

export function NotionDatabaseDialog({
  open,
  onOpenChange,
  isLoadingPages,
  pages,
  selectedPageId,
  setSelectedPageId,
  newDbName,
  setNewDbName,
  isCreatingDatabase,
  createDatabase,
  setOpenCreatePageDialog,
  newDbTemplate,
  setNewDbTemplate,
}: NotionDatabaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notion Database</DialogTitle>
          <DialogDescription>
            This will create a new database in your Notion workspace. Select a parent page for the new database.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Parent Page</Label>
            {isLoadingPages ? (
                <Skeleton className="h-10 w-full" />
            ) : pages && pages.length > 0 ? (
              <Select
                onValueChange={setSelectedPageId}
                value={selectedPageId || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <PageSearchableList pages={pages} setSelectedPageId={setSelectedPageId} />
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                <p>No pages found.</p>
                <p>
                  Please create a page in Notion first and ensure you've given access to it.
                </p>
                <Button variant="link" onClick={() => setOpenCreatePageDialog(true)}>
                  Or create a new page
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="db-name">Database Name</Label>
            <Input
              id="db-name"
              value={newDbName}
              onChange={(e) => setNewDbName(e.target.value)}
              placeholder="e.g. My New Form Submissions"
            />
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select
              value={newDbTemplate}
              onValueChange={setNewDbTemplate}
            >
              <SelectTrigger
                className="w-full"
                tabIndex={0}
              >
                <SelectValue placeholder="Choose a template (optional)" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="none">No template</SelectItem>
                {Object.entries(NOTION_DATABASE_TEMPLATES).map(([key, tpl]) => (
                  <SelectItem key={key} value={key}>
                    {tpl.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={createDatabase}
            disabled={!selectedPageId || !newDbName || isCreatingDatabase}
          >
            {isCreatingDatabase ? "Creating..." : "Create Database"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
