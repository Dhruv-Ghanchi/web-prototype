import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "supervisor" | "seller" | "buyer" | "admin";

export const DEMO_ACCOUNTS: Record<Role, { email: string; name: string; hub?: string }> = {
  supervisor: { email: "priya@returnflow.in", name: "Priya Nair", hub: "Mumbai · Andheri" },
  seller: { email: "raj@nordicthreads.in", name: "Raj Kapoor" },
  buyer: { email: "anita@gmail.com", name: "Anita Sharma" },
  admin: { email: "admin@returnflow.in", name: "Admin" },
};

type SessionState = {
  role: Role | null;
  name: string | null;
  email: string | null;
  city: string;
  hubScope: string; // for admin
  login: (role: Role) => void;
  logout: () => void;
  setCity: (c: string) => void;
  setHubScope: (h: string) => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      role: null,
      name: null,
      email: null,
      city: "Mumbai",
      hubScope: "All Hubs",
      login: (role) => {
        const a = DEMO_ACCOUNTS[role];
        set({ role, name: a.name, email: a.email });
      },
      logout: () => set({ role: null, name: null, email: null }),
      setCity: (city) => set({ city }),
      setHubScope: (hubScope) => set({ hubScope }),
    }),
    { name: "returnflow-session" }
  )
);

type CartState = {
  items: string[]; // product ids
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (id) => set((s) => ({ items: [...s.items, id] })),
      remove: (id) => set((s) => ({ items: s.items.filter((x) => x !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "returnflow-cart" }
  )
);
