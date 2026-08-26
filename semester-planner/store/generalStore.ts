import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GeneralStore {
    version: string;
    showInfoHint: boolean;
    hideInfoHint: () => void;
}

export const useGeneralStore = create<GeneralStore>()(
    persist(
        (set) => ({
            version: process.env.NEXT_PUBLIC_APP_VERSION ?? "",
            showInfoHint: true,
            hideInfoHint: () => set({ showInfoHint: false }),
        }),
        {
            name: "general-storage",
            storage: createJSONStorage(() => localStorage),
            // nur das flag persistieren, sonst überschreibt eine alte gespeicherte version die aktuelle
            partialize: (state) => ({ showInfoHint: state.showInfoHint }),
        }
    )
);
