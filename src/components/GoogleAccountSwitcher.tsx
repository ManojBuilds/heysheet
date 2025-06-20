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
import { handleAddNewGoogleAccount } from "@/actions";
import { useGoogleAccountsStore } from "@/stores/google-accounts-store";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

interface GoogleAccount {
  access_token: string;
  email: string;
  id: string;
}

const GoogleAccountSwitcher = () => {
  const { userId } = useAuth();

  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    isLoading,
    fetchAccounts,
  } = useGoogleAccountsStore();

  useEffect(() => {
    console.log("fetchingaccounts", userId);
    if (!userId) return;
    fetchAccounts(userId);
  }, [userId, fetchAccounts]);

  if (isLoading)
    return <div className="bg-muted h-9 w-52 animate-pulse rounded-sm"></div>;
  if (accounts?.length === 0) return null;

  const handleValueChange = (value: string) => {
    if (value === "add-new") {
      handleAddNewGoogleAccount();
    } else {
      setSelectedAccount(value);
    }
  };

  return (
    <Select value={selectedAccount?.id || ""} onValueChange={handleValueChange}>
      <SelectTrigger>
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
