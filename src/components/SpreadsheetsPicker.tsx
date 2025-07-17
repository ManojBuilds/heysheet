"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGoogleAccountsStore } from "@/stores/google-accounts-store";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getSheetTabs } from "@/lib/google/sheets";
import useDrivePicker from "react-google-drive-picker";

type Spreadsheet = {
  id: string;
  name: string;
  url: string;
};

export default function SpreadsheetSelect({
  onPick,
  disabled,
  onSheetNamePick,
  onOpenPicker,
  selectedSheet,
  onClearSelection,
}: {
  onPick: (sheet: Spreadsheet) => void;
  disabled?: boolean;
  onSheetNamePick: (sheetName: string) => void;
  onOpenPicker?: () => void;
  selectedSheet: Spreadsheet | null;
  onClearSelection: () => void;
}) {
  const { selectedAccount } = useGoogleAccountsStore();
  const [currentGoogleAccountId, setCurrentGoogleAccountId] = useState("");

  const [openPicker, authResponse] = useDrivePicker();

  const {
    data: sheetNames = [],
    isLoading: isLoadingSheetNames,
    error: errorSheetNames,
  } = useQuery({
    queryKey: ["sheet-names", selectedSheet?.id, selectedAccount],
    queryFn: () => {
      if (!selectedAccount?.id || !selectedSheet?.id) return [];
      return getSheetTabs(selectedAccount.id, selectedSheet.id);
    },
    enabled: !!selectedSheet?.id && !!selectedAccount?.id,
  });

  const handleOpenPicker = () => {
    if (onOpenPicker) {
      onOpenPicker();
    }
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
      viewId: "SPREADSHEETS",
      // token: selectedAccount?.accessToken || "",
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User cancelled the picker");
          return;
        }

        if (data.action === "picked") {
          const pickedFile = data.docs[0];
          console.log(pickedFile);
          const spreadsheet: Spreadsheet = {
            id: pickedFile.id,
            name: pickedFile.name,
            url: pickedFile.url,
          };

          onPick(spreadsheet);
          toast.success(`Selected spreadsheet: ${pickedFile.name}`);
        }
      },
    });
  };

  // Reset sheet names when selected sheet changes
  useEffect(() => {
    if (selectedSheet && onSheetNamePick) {
      // Reset the sheet name selection when a new spreadsheet is selected
      onSheetNamePick("");
    }
  }, [selectedSheet, onSheetNamePick]);
  console.log({ selectedSheet })

  return (
    <div className="flex gap-2">
      <div className="space-y-2 flex-1">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenPicker}
            disabled={disabled}
            className="flex-1"
          >
            {selectedSheet ? selectedSheet.name : "Pick a spreadsheet"}
          </Button>
          {selectedSheet && (
            <Button
              type="button"
              variant="ghost"
              size={'icon'}
              onClick={() => {
                onClearSelection();
              }}
              disabled={disabled}
              className="px-3"
              aria-label="Remove selected spreadsheet"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Select
          disabled={disabled || isLoadingSheetNames || !selectedSheet}
          onValueChange={(val) => {
            if (onSheetNamePick) onSheetNamePick(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedSheet
                  ? "Select spreadsheet first"
                  : isLoadingSheetNames
                    ? "Loading..."
                    : "Select the sheet tab"
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
            Error loading sheet tabs: {errorSheetNames.message}
          </div>
        )}
      </div>
    </div>
  );
}
