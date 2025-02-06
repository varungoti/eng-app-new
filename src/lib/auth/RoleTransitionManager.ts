import { supabase } from '../supabase';
import { useRoleStore } from './store';
import { logger } from '../logger';
import type { UserRole } from '../../types/roles';
import type { School } from '@/types';

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

  public async transitionRole(newRole: UserRole, school?: School): Promise<void> {
    const store = useRoleStore.getState();
    
    if (store.isTransitioning || this.isTransitioning || newRole === store.currentRole) {
      return;
    }

    this.isTransitioning = true;
    store.startTransition();
    
    try {
      // First try to refresh the session
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;

      const session = refreshData?.session;
      if (!session) throw new Error('Please sign in to change roles');

      // Save previous state in session storage
      sessionStorage.setItem('roleTransition', JSON.stringify({
        previousRole: store.currentRole,
        currentRole: newRole,
        impersonatedSchool: school || null,
        isImpersonating: !!school
      }));

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          role: newRole,
          previous_role: store.currentRole,
          school_id: school?.id,
          updated_at: new Date().toISOString()
        }
      });

      if (updateError) throw updateError;

      store.setRole(newRole);
      store.completeTransition();

    } catch (err) {
      store.resetTransition();
      sessionStorage.removeItem('roleTransition');
      logger.error('Role transition failed', {
        context: { error: err, from: store.currentRole, to: newRole },
        source: 'RoleTransitionManager'
      });
      throw err;
    } finally {
      this.isTransitioning = false;
    }
  }
}

export const roleTransitionManager = RoleTransitionManager.getInstance();