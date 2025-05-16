"use client";

import { useEffect, useMemo, useState } from "react";
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
import { createGoogleSheet } from "@/lib/google/sheets-client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { getExistingSheets } from "@/lib/google/sheets";
import { drive_v3 } from "googleapis";
import { SpreadsheetPicker } from "./SpreadsheetsPicker";
import { useRouter } from "next/navigation";

type GoogleAccount = {
  id: string;
  email: string;
  access_token: string;
};

export default function NewEndpointForm() {
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>([]);
  const [googleAccountId, setGoogleAccountId] = useState<string>("");
  const [oauthToken, setOauthToken] = useState<string>("");
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [createSpreadsheet, setCreateSpreadsheet] = useState(true);
  const [headerRow, setHeaderRow] = useState(true);

  const [existingSpreadsheets, setExistingSpreadsheets] = useState<
    drive_v3.Schema$File[]
  >([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const fetchGoogleAccounts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("google_accounts")
        .select("id, email, access_token")
        .eq("user_id", user?.id);
      console.log("@data", data);

      if (error) {
        toast.error("Failed to load Google accounts");
        return;
      }
      setGoogleAccounts(data || []);
      if (data && data.length > 0) {
        setGoogleAccountId(data[0].id);
        setOauthToken(data[0].access_token);
      }
    };
    if (user?.id) fetchGoogleAccounts();
  }, [user?.id]);

  useEffect(() => {
    const account = googleAccounts.find((a) => a.id === googleAccountId);
    setOauthToken(account?.access_token || "");
  }, [googleAccountId, googleAccounts]);

  useEffect(() => {
    const fetchSpreadsheets = async () => {
      try {
        const res = await getExistingSheets(googleAccountId);
        console.log("@existingSpreadsheets", res);
        setExistingSpreadsheets(res);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user spreadsheets");
      }
    };
    console.log({ googleAccountId });
    if (googleAccountId) {
      fetchSpreadsheets();
    }
  }, [googleAccountId]);

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
            name
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
      toast.success("Endpoint created successfully");
      setIsOpen(false);
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

  const filteredSpreadsheets = useMemo(
    () =>
      existingSpreadsheets?.filter((s) =>
        s.name?.toLowerCase().includes(searchVal.toLowerCase())
      ),
    [searchVal, existingSpreadsheets]
  );

  return (
    <>
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
              <SpreadsheetPicker
                googleAccountId={googleAccountId}
                oauthToken={oauthToken}
                onPicked={(data) => {
                  setSpreadsheetId(data.id);
                  setSheetName(data.name);
                  console.log(
                    "User has selected existing spreadsheets: ",
                    data
                  );
                }}
              />
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Endpoint"}
        </Button>
      </form>
    </>
  );
}
