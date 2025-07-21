import { useGoogleAccountsStore } from '@/stores/google-accounts-store';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const useGoogleAccounts = () => {
  const { user } = useUser();
  const {
    accounts,
    selectedAccount,
    isLoading,
    error,
    fetchAccounts,
    setSelectedAccount,
    clearError,
    updateAccount
  } = useGoogleAccountsStore();

  useEffect(() => {
    if (user?.id && accounts.length === 0 && !isLoading) {
      fetchAccounts(user.id);
    }
  }, [user?.id, fetchAccounts, accounts.length, isLoading]);
  

  return {
    accounts,
    selectedAccount,
    isLoading,
    error,
    setSelectedAccount,
    clearError,
    refetch: () => user?.id && fetchAccounts(user.id),
    updateAccount
  };
};
