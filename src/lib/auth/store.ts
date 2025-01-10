import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '../../types/roles';
import { logger } from '../logger';

interface RoleState {
  currentRole: UserRole | null;
  previousRole: UserRole | null;
  isTransitioning: boolean;
  setRole: (role: UserRole | null) => void;
  startTransition: () => void;
  completeTransition: () => void;
  resetTransition: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      currentRole: null,
      previousRole: null,
      isTransitioning: false,
      setRole: (role) => set((state) => {
        logger.info('Role state update', {
          context: { from: state.currentRole, to: role },
          source: 'RoleStore'
        });
        return {
          currentRole: role,
          previousRole: state.currentRole,
          isTransitioning: false
        };
      }),
      startTransition: () => set({ isTransitioning: true }),
      completeTransition: () => set({ isTransitioning: false, previousRole: null }),
      resetTransition: () => set({ isTransitioning: false })
    }),
    {
      name: 'role-storage',
      partialize: (state) => ({ currentRole: state.currentRole })
    }
  )
);