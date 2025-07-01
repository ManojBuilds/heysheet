import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NotionPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPageName: string;
  setNewPageName: (name: string) => void;
  isCreatingPage: boolean;
  createPage: () => void;
}

export function NotionPageDialog({
  open,
  onOpenChange,
  newPageName,
  setNewPageName,
  isCreatingPage,
  createPage,
}: NotionPageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notion Page</DialogTitle>
          <DialogDescription>
            This will create a new page in your Notion workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="page-name">Page Name</Label>
          <Input
            id="page-name"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="e.g. My New Page"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={createPage}
            disabled={!newPageName || isCreatingPage}
          >
            {isCreatingPage ? "Creating..." : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
