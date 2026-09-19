import { create } from "zustand";
import { IUser } from "@/database/model";
import { persist } from "zustand/middleware";

interface IAppState {
  search: string;
  setSearch: (search: string) => void;
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
  openDialog: string | null;
  setOpenDialog: (openDialog: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAppStore = create<IAppState>()(
  persist(
    (set) => ({
      search: "",
      setSearch: (search) => set({ search }),
      user: undefined,
      setUser: (user) => set({ user }),
      openDialog: null,
      setOpenDialog: (openDialog) => set({ openDialog }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "useAppStore",
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (!error) {
            state?.setHasHydrated(true);
          }
        };
      },
    },
  ),
);
