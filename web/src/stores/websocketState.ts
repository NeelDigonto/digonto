import { create, ExtractState } from "zustand";
import { combine } from "zustand/middleware";

export const useWebSocketStore = create(
  combine({ open: false }, (set) => ({
    setOPEN: () => set(() => ({ open: true })),
    setCLOSED: () => set(() => ({ open: false })),
    toggleOpen: () => set((state) => ({ open: !state.open })),
  }))
);

export type WebSocketState = ExtractState<typeof useWebSocketStore>;
