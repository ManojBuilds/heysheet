import { create } from 'zustand';
import { getGoogleAccounts } from '@/actions';

interface GoogleAccount {
  id: string;
  email: string;
  access_token: string;
}

interface GoogleAccountsState {
  accounts: GoogleAccount[];
  selectedAccount: GoogleAccount | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAccounts: (accounts: GoogleAccount[]) => void;
  setSelectedAccount: (accountId: string) => void;
  fetchAccounts: (userId: string) => Promise<void>;
  addAccount: (account: GoogleAccount) => void;
  removeAccount: (accountId: string) => void;
  clearError: () => void;
}

export const useGoogleAccountsStore = create<GoogleAccountsState>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,

  setAccounts: (accounts) => {
    const firstAccountId = accounts.length > 0 ? accounts[0] : null;
    set({ 
      accounts,
      selectedAccount: get().selectedAccount || firstAccountId
    });
  },

  setSelectedAccount: (accountId) => {
    const { accounts } = get();
    const accountExists = accounts.some(account => account.id === accountId);
    if (accountExists) {
      set({ selectedAccount: accounts.find((acc)=>acc.id===accountId) });
    }
  },

  fetchAccounts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await getGoogleAccounts(userId);
      get().setAccounts(accounts);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch Google accounts' });
    } finally {
      set({ isLoading: false });
    }
  },

  addAccount: (account) => {
    const { accounts } = get();
    const updatedAccounts = [...accounts, account];
    set({ 
      accounts: updatedAccounts,
      selectedAccount: account
    });
  },

  removeAccount: (accountId) => {
    const { accounts, selectedAccount } = get();
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    const newSelectedAccount = selectedAccount?.id === accountId 
      ? (updatedAccounts.length > 0 ? updatedAccounts[0] : null)
      : selectedAccount;
    
    set({ 
      accounts: updatedAccounts,
      selectedAccount: newSelectedAccount
    });
  },

  clearError: () => set({ error: null })
}));