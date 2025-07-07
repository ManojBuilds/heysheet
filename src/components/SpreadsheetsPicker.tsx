"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useGoogleAccountsStore } from "@/stores/google-accounts-store";
import { toast } from "sonner";

type Spreadsheet = {
  id: string;
  name: string;
  url: string;
};

export default function SpreadsheetSelect({
  onPick,
  disabled,
}: {
  onPick: (sheet: Spreadsheet) => void;
  disabled?: boolean;
}) {
  const { selectedAccount } = useGoogleAccountsStore();
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedAccount?.access_token) return;

    setLoading(true);

    fetch(
      `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'+and+trashed=false&fields=files(id,name)&pageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${selectedAccount.access_token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        const files: Spreadsheet[] = (data.files || []).map((file: any) => ({
          id: file.id,
          name: file.name,
          url: `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
        }));
        setSpreadsheets(files);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load spreadsheets.");
      })
      .finally(() => setLoading(false));
  }, [selectedAccount?.access_token]);

  const filteredSpreadsheets = spreadsheets.filter((sheet) =>
    sheet.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <Select
        disabled={disabled || loading}
        onValueChange={(val) => {
          const picked = spreadsheets.find((s) => s.id === val);
          if (picked) onPick(picked);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={loading ? "Loading..." : "Pick a spreadsheet"}
          />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2" onMouseDown={(e) => e.stopPropagation()}>
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full"
            />
          </div>
          {filteredSpreadsheets.map((sheet) => (
            <SelectItem key={sheet.id} value={sheet.id}>
              {sheet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
