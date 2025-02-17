import { supabase } from '../supabase';
import { useRoleStore } from './store';
import { logger } from '../logger';
import type { UserRole } from '../../types/roles';

class RoleTransitionManager {
  private static instance: RoleTransitionManager;
  private isTransitioning = false;

  private constructor() {}

  public static getInstance(): RoleTransitionManager {
    if (!RoleTransitionManager.instance) {
      RoleTransitionManager.instance = new RoleTransitionManager();
    }
    return RoleTransitionManager.instance;
  }

  public async transitionRole(newRole: UserRole): Promise<void> {
    const store = useRoleStore.getState();
    
    if (store.isTransitioning) {
      return;
    }

    if (newRole === store.currentRole) {
      return;
    }

    if (this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;
    store.startTransition();
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session');
      }

      // Use stored procedure for role change
      await supabase.rpc('handle_role_change', {
        p_user_id: session.user.id,
        p_new_role: newRole,
        p_old_role: store.currentRole
      });

      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;

      store.setRole(newRole);
      store.completeTransition();

      logger.info(`Role transition completed successfully from ${store.currentRole || 'none'} to ${newRole}`, 'RoleTransitionManager');


    } catch (err) {
      store.resetTransition();

      logger.error(`Role transition failed: ${err instanceof Error ? err.message : String(err)}`, 'RoleTransitionManager');

      throw err;
    } finally {
      this.isTransitioning = false;
    }
  }
}

export const roleTransitionManager = RoleTransitionManager.getInstance();