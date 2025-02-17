import { supabase } from '../supabase';
import { useRoleStore } from './store';
import { logger } from '../logger';
import type { UserRole } from '../../types/roles';

class RoleSyncService {
  private static instance: RoleSyncService;

  private constructor() {
    this.setupAuthListener();
  }

  public static getInstance(): RoleSyncService {
    if (!RoleSyncService.instance) {
      RoleSyncService.instance = new RoleSyncService();
    }
    return RoleSyncService.instance;
  }

  private setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const role = session?.user?.user_metadata?.role as UserRole;
        if (role) {
          this.syncRole(role);
        }
      }
    });
  }

  private syncRole(role: UserRole) {
    const store = useRoleStore.getState();
    const currentRole = store.currentRole;

    if (currentRole !== role) {
      logger.info(`Syncing role state from ${currentRole || 'none'} to ${role}`, { source: 'RoleSyncService' });
      store.setRole(role);
    }
  }

  public async updateRole(newRole: UserRole): Promise<void> {
    try {
      const store = useRoleStore.getState();
      store.startTransition();

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: newRole }
      });

      if (updateError) throw updateError;

      // Force session refresh
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;

      // Update store state
      this.syncRole(newRole);
      store.completeTransition();

      logger.info(`Role updated successfully to ${newRole}`, { source: 'RoleSyncService' });


      // Force page reload to ensure clean state
      window.location.reload();
    } catch (err) {
      useRoleStore.getState().resetTransition();
      logger.error(`Failed to update role: ${err instanceof Error ? err.message : String(err)}`, { source: 'RoleSyncService' });
      throw err;

    }
  }
}

export const roleSyncService = RoleSyncService.getInstance();