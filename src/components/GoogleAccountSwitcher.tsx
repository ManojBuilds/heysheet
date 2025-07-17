"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectSeparator,
} from "./ui/select";

import { Mail, Plus } from "lucide-react";
import { getGoogleConnectUrl } from "@/actions";
import { useAuth } from "@clerk/nextjs";
import { useGoogleAccounts } from "@/hooks/use-google-accounts-store";

const GoogleAccountSwitcher = () => {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isLoading,
  } = useGoogleAccounts();

  if (isLoading)
    return <div className="bg-muted h-9 w-52 animate-pulse rounded-sm"></div>;
  if (accounts?.length === 0) return null;

  const handleValueChange = async (value: string) => {
    if (value === "add-new") {
      const link = await getGoogleConnectUrl()
      if (link) {
        window.location.href = link;
      }
    } else {
      setSelectedAccount(value);
    }
  };

  return (
    <Select value={selectedAccount?.id || ""} onValueChange={handleValueChange}>
      <SelectTrigger className="hidden sm:inline-flex">
        <Mail className="w-4 h-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {accounts?.map((account: { id: string; email: string }) => (
          <SelectItem key={account.id} value={account.id}>
            {account.email}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value="add-new">
          <Plus /> Add New Google Account
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GoogleAccountSwitcher;
