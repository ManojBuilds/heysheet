"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createGoogleSheet } from "@/lib/google/sheets-client";
import { PlusCircle } from "lucide-react";
import useGoogleAccounts from "@/hooks/use-google-accounts";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type GoogleAccount = {
  id: string;
  email: string;
};

type Props = {
  googleAccounts: GoogleAccount[];
  userId: string;
};

export default function NewEndpointForm() {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  const { googleAccounts } = useGoogleAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [googleAccountId, setGoogleAccountId] = useState(
    googleAccounts[0]?.id || ""
  );
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [createSpreadsheet, setCreateSpreadsheet] = useState(true);
  const [headerRow, setHeaderRow] = useState(true);

  // Generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // If creating a new spreadsheet
      let finalSpreadsheetId = spreadsheetId;

      if (createSpreadsheet && !spreadsheetId) {
        try {
          const sheet = await createGoogleSheet(
            googleAccountId,
            sheetName,
            `${name} - FormSync`
          );
          finalSpreadsheetId = sheet.spreadsheetId;
        } catch (err: any) {
          setError(`Failed to create Google Sheet: ${err.message}`);
          toast.error(`Failed to create Google Sheet: ${err.message}`);
          setIsLoading(false);
          return;
        }
      }

      // Create the endpoint
      const { data, error } = await supabase
        .from("endpoints")
        .insert({
          user_id: userId,
          name,
          slug,
          description,
          google_account_id: googleAccountId,
          spreadsheet_id: finalSpreadsheetId,
          sheet_name: sheetName,
          create_spreadsheet_if_missing: createSpreadsheet,
          header_row: headerRow,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("Endpoint: ", data);
      toast.success('Endpoint created successfully');
      setIsOpen(false)
      // Redirect to dashboard
      router.push("/dashboard?success=endpoint_created");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating endpoint:", err);
      toast.error("Error creating endpoint");
      setError(err.message || "Failed to create endpoint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Endpoint</DialogTitle>
          <DialogDescription>
            Please create new endpoint to start collecting responses
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Endpoint Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contact Form"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Endpoint Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="contact-form"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used in your form submission URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Form on the contact page"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleAccount">Google Account</Label>
            <Select value={googleAccountId} onValueChange={setGoogleAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Google Account" />
              </SelectTrigger>
              <SelectContent>
                {googleAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="createSpreadsheet"
                checked={createSpreadsheet}
                onCheckedChange={(checked) =>
                  setCreateSpreadsheet(checked as boolean)
                }
              />
              <div>
                <Label
                  htmlFor="createSpreadsheet"
                  className="text-base font-medium cursor-pointer"
                >
                  Create a new Google Sheet
                </Label>
                <p className="text-sm text-muted-foreground">
                  A new Google Sheet will be created for this endpoint
                </p>
              </div>
            </div>

            {!createSpreadsheet && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="spreadsheetId">Existing Spreadsheet ID</Label>
                <Input
                  id="spreadsheetId"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  required={!createSpreadsheet}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Google Sheet URL
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sheetName">Sheet Name</Label>
              <Input
                id="sheetName"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Sheet1"
                required
              />
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="headerRow"
              checked={headerRow}
              onCheckedChange={(checked) => setHeaderRow(checked as boolean)}
            />
            <div>
              <Label
                htmlFor="headerRow"
                className="text-base font-medium cursor-pointer"
              >
                Add header row
              </Label>
              <p className="text-sm text-muted-foreground">
                The first row will contain field names from your form
              </p>
            </div>
          </div>
        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Endpoint"}
          </Button>
        </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
