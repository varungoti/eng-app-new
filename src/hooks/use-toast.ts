import { create } from 'zustand'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export interface ToastStore {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  toast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Math.random().toString() }]
  }))
})) 