import { create } from 'zustand';

interface ResetStore {
    onResetCallback: (() => void) | null;
    setResetCallback: (cb: () => void) => void;
    reset: () => void;
}

export const useResetStore = create<ResetStore>((set, get) => ({
    onResetCallback: null,

    setResetCallback: (cb) => set({ onResetCallback: cb }),

    reset: () => {
        const callback = get().onResetCallback;

        if (callback) {
            callback();
        }
    },
}));