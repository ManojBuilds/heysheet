import React, { useEffect } from "react";
import { Button } from "./ui/button";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface SpreadsheetPickerProps {
  googleAccountId: string;
  oauthToken: string; // You must fetch this from your backend for the user
  onPicked: (spreadsheet: { id: string; name: string }) => void;
}

export const SpreadsheetPicker: React.FC<SpreadsheetPickerProps> = ({
  googleAccountId,
  oauthToken,
  onPicked,
}) => {
    console.log("apiKey",process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  useEffect(() => {
    // Load the Google Picker script
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("picker", { callback: () => {} });
    };
    document.body.appendChild(script);
  }, []);

  const openPicker = () => {
    if (!window.gapi?.picker) return;

    const view = new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS)
      .setMimeTypes("application/vnd.google-apps.spreadsheet")
      .setSelectFolderEnabled(false);

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY) // Set your API key
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const doc = data.docs[0];
          onPicked({ id: doc.id, name: doc.name });
        }
      })
      .build();

    picker.setVisible(true);
  };

  return (
    <Button type="button" onClick={openPicker}>
      Pick a Google Spreadsheet
    </Button>
  );
};