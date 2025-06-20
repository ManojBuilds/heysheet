import { create } from "zustand";

interface UpgradeModalState {
    isOpen: boolean;
    heading?: string;
    subHeading?: string;
    cta?: string;

    // actions
    openUpgradeModal: ({ heading, subHeading, cta }: { heading?: string, subHeading?: string, cta?: string }) => void;
    close: () => void;
    updateIsOpen: (isOpen: boolean) => void;
}

export const useUpgradeModalStore = create<UpgradeModalState>((set, get) => ({
    isOpen: false,
    heading: 'Upgrade Required',
    subHeading: "You've reached the limit for your current plan. Upgrade now to unlock more features and keep building with HeySheet.",
    cta: 'View Plans',
    updateIsOpen: (isOpen) => {
        set({ isOpen });
    },
    openUpgradeModal: (options = {}) => {
        const { heading, subHeading, cta } = options;
        const current = get();

        set({
            isOpen: true,
            heading: heading ?? current.heading,
            subHeading: subHeading ?? current.subHeading,
            cta: cta ?? current.cta
        });
    },


    close: () => {
        set({
            isOpen: false,
            heading: undefined,
            subHeading: undefined,
            cta: undefined
        });
    },

}));
