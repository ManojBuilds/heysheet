"use client";
import { useGoogleAccountsStore } from "@/stores/google-accounts-store";
import { Button } from "./ui/button";
import useDrivePicker from "react-google-drive-picker";
import {
  CallbackDoc,
  PickerCallback,
} from "react-google-drive-picker/dist/typeDefs";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";

const SpreadsheetsPicker = ({
  onPicked,
  selectedSheet,
  disabled,
}: {
  onPicked: (data: PickerCallback) => void;
  selectedSheet: CallbackDoc | null;
  disabled?: boolean;
}) => {
  const { selectedAccount } = useGoogleAccountsStore();
  const [openPicker, authResponse] = useDrivePicker();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenPicker = async () => {
    setIsLoading(true);
    setError(null);
    try {
      openPicker({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        developerKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
        viewId: "SPREADSHEETS",
        // token: selectedAccount?.access_token,
        showUploadView: true,
        showUploadFolders: false,
        supportDrives: true,
        multiselect: false,
        callbackFunction: (data) => {
          if (data.action === "cancel") {
            setIsLoading(false);
            return;
          }
          onPicked(data);
          setIsLoading(false);
        },
      });
    } catch (err) {
      setError("Failed to open Google Drive Picker.");
      setIsLoading(false);
    }
  };
  console.log(authResponse)

  return (
    <div>
      <Button
        type="button"
        onClick={handleOpenPicker}
        className="w-full"
        leftIcon={
          isLoading ? <Loader2 className="animate-spin" /> : <FileSpreadsheet />
        }
        variant={"secondary"}
        disabled={isLoading || disabled}
      >
        {selectedSheet ? selectedSheet.name : "Pick an existing spreadsheet"}
      </Button>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  );
};

export default SpreadsheetsPicker;
