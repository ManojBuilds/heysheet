import { create } from 'zustand';
import { getGoogleAccounts } from '@/actions';

interface GoogleAccount {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
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
  updateAccount: (accountId: string, updatedAccount: Partial<GoogleAccount>) => void;
  clearError: () => void;
}

export const useGoogleAccountsStore = create<GoogleAccountsState>((set, get) => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,

  setAccounts: (accounts) => {
    const firstAccount = accounts.length > 0 ? accounts[0] : null;
    set({ 
      accounts,
      selectedAccount: get().selectedAccount || firstAccount
    });
  },

  setSelectedAccount: (accountId) => {
    const { accounts } = get();
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      set({ selectedAccount: account });
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
    set((state) => ({
      accounts: [...state.accounts, account],
      selectedAccount: account,
    }));
  },

  removeAccount: (accountId) => {
    set((state) => {
      const updatedAccounts = state.accounts.filter(account => account.id !== accountId);
      const newSelectedAccount = state.selectedAccount?.id === accountId 
        ? (updatedAccounts.length > 0 ? updatedAccounts[0] : null)
        : state.selectedAccount;
      
      return { 
        accounts: updatedAccounts,
        selectedAccount: newSelectedAccount
      };
    });
  },

  updateAccount: (accountId, updatedAccount) => {
    set((state) => {
      const updatedAccounts = state.accounts.map(account =>
        account.id === accountId ? { ...account, ...updatedAccount } : account
      );

      const newSelectedAccount = state.selectedAccount?.id === accountId
        ? { ...state.selectedAccount, ...updatedAccount }
        : state.selectedAccount;

      return {
        accounts: updatedAccounts,
        selectedAccount: newSelectedAccount,
      };
    });
  },

  clearError: () => set({ error: null })
}));
