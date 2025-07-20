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
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSheetTabs } from "@/lib/google/sheets";
import useDrivePicker from "react-google-drive-picker";
import { useGoogleAccounts } from "@/hooks/useGoogleAccount";
import { updateGoogleAccountInDb } from "@/actions";

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
  const { selectedAccount, updateAccount } = useGoogleAccounts();
  const [currentGoogleAccountId, setCurrentGoogleAccountId] = useState("");
  const [openPicker, authResponse] = useDrivePicker();
  const [token, setToken] = useState(selectedAccount?.access_token)

  const { mutate: refreshToken } = useMutation({
    mutationFn: async (googleAccountId: string) => {
      const response = await fetch("/api/google/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleAccountId }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (selectedAccount) {
        const updatedAccount = {
          ...selectedAccount,
          access_token: data.accessToken,
          token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        };
        updateAccount(selectedAccount.id, updatedAccount);
        openPickerWithToken(data.accessToken);
        updateGoogleAccountInDb(selectedAccount.id, updatedAccount);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const openPickerWithToken = (token: string) => {
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
      viewId: "SPREADSHEETS",
      token: token,
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

  const handleOpenPicker = () => {
    if (onOpenPicker) {
      onOpenPicker();
    }

    if (selectedAccount) {
      const expiresAt = new Date(
        selectedAccount.token_expires_at || ""
      ).getTime();
      if (Date.now() > expiresAt) {
        refreshToken(selectedAccount.id);
      } else {
        openPickerWithToken(selectedAccount.access_token);
      }
    }
  };

  // Reset sheet names when selected sheet changes
  useEffect(() => {
    if (selectedSheet && onSheetNamePick) {
      // Reset the sheet name selection when a new spreadsheet is selected
      onSheetNamePick("");
    }
  }, [selectedSheet, onSheetNamePick]);
  console.log({ selectedSheet });

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
              size={"icon"}
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
