import { create } from 'zustand'

export const usePortfolioStore = create((set) => ({
  copied: false,
  markCopied: () => {
    set({ copied: true })
    window.setTimeout(() => set({ copied: false }), 1800)
  },
}))
