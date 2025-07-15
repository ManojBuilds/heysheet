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
import { useQuery } from "@tanstack/react-query";
import { getExistingSheets, getSheetTabs } from "@/lib/google/sheets";

type Spreadsheet = {
  id: string;
  name: string;
  url: string;
};

export default function SpreadsheetSelect({
  onPick,
  disabled,
  onSheetNamePick,
}: {
  onPick: (sheet: Spreadsheet) => void;
  disabled?: boolean;
  onSheetNamePick: (sheetName: string) => void;
}) {
  const { selectedAccount } = useGoogleAccountsStore();
  const [search, setSearch] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");

  const {
    isLoading,
    data: spreadsheets = [],
    error,
  } = useQuery({
    queryKey: ["existing-spreadsheets", selectedAccount?.id],
    queryFn: () => {
      if (!selectedAccount?.id) return [];
      return getExistingSheets(selectedAccount.id);
    },
    enabled: !!selectedAccount?.id,
  });

  const {
    data: sheetNames = [],
    isLoading: isLoadingSheetNames,
    error: errorSheetNames,
  } = useQuery({
    queryKey: ["sheet-names", selectedSheet, selectedAccount],
    queryFn: () => {
      if (!selectedAccount?.id || !selectedSheet) return [];
      return getSheetTabs(selectedAccount.id, selectedSheet);
    },
    enabled: !!selectedSheet && !!selectedAccount?.id,
  });

  const filteredSpreadsheets = spreadsheets?.filter((sheet) =>
    sheet.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex gap-2">
      <div className="space-y-2 flex-1">
        <Select
          disabled={disabled || isLoading}
          onValueChange={(val) => {
            const picked = spreadsheets?.find((s) => s.id === val);
            setSelectedSheet(picked?.id || "");
            if (picked) onPick(picked);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={isLoading ? "Loading..." : "Pick a spreadsheet"}
            />
          </SelectTrigger>
          <SelectContent className="max-h-[480px] overflow-y-auto">
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

        {error && (
          <div className="text-sm text-red-500">
            Error loading spreadsheets: {error.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Select
          disabled={disabled || isLoadingSheetNames}
          onValueChange={(val) => {
            if (onSheetNamePick) onSheetNamePick(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingSheetNames ? "Loading..." : "Select the sheet tab"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {sheetNames?.map((sheet) => (
              <SelectItem key={sheet} value={sheet || "No tab"}>
                {sheet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errorSheetNames && (
          <div className="text-sm text-red-500">
            Error loading spreadsheets: {errorSheetNames.message}
          </div>
        )}
      </div>
    </div>
  );
}
