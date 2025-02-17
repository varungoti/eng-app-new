import { supabase } from '../supabase';
import { logger } from '../logger';
import type { Session } from '@supabase/gotrue-js';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public async updateUserRole(newRole: UserRole): Promise<void> {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        // Try to refresh session first
        const { data: { session: refreshedSession }, error: refreshError } = 
          await supabase.auth.refreshSession();
          
        if (refreshError) throw refreshError;
        if (!refreshedSession) throw new Error('No session available');
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: newRole }
      });

      if (updateError) throw updateError;
      
      // Verify session is still valid
      const { data: { session: verifiedSession }, error: verifyError } = 
        await supabase.auth.getSession();
        
      if (verifyError || !verifiedSession) {
        throw new Error('Session validation failed after role update');
      }

      logger.info(`Role updated successfully to ${newRole}`, 'SessionManager');
    } catch (err) {
      logger.error(`Failed to update role: ${err instanceof Error ? err.message : String(err)}`, 'SessionManager');
      throw err;

    }
  }

  public async refreshSession(): Promise<Session | null> {
    try {
      // Get current session with retry
      let session;
      for (let i = 0; i < 3; i++) {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (!error && currentSession) {
          session = currentSession;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!session) {
        // Try to refresh session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          throw new Error('No active session available');
        }
        session = refreshData.session;
      }

      // Update session expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
      
      const sessionData = {
        ...session,
        expires_at: expiryDate.toISOString()
      };

      localStorage.setItem('sb-auth-token', JSON.stringify(sessionData));

      logger.info(`Session refreshed successfully with expiry ${expiryDate.toISOString()}`, 'SessionManager');


      return session;
    } catch (err) {
      logger.error(`Failed to refresh session: ${err instanceof Error ? err.message : String(err)}`, 'SessionManager');
      throw err;
    }

  }
}

export const sessionManager = SessionManager.getInstance();