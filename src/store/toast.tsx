typescript
// src/store/toast.tsx
import { create } from "zustand";

type Toast = { id: number; message: string; type?: "success" | "error" };

export const useToastStore = create((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now();
    set({ toasts: [...get().toasts, { id, ...t }] });
    setTimeout(() => get().remove(id), 4000); // Auto-remove after 4 seconds [18]
  },
  remove: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) })
}));
