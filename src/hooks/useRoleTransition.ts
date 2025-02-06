"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './useToast';
import { School } from '@/types';

export type Role = 'super_admin' | 'principal' | 'teacher' | 'admin' | 'coordinator';

interface RoleTransitionState {
  previousRole: Role | null;
  currentRole: Role;
  impersonatedSchool: School | null;
  isImpersonating: boolean;
}

export function useRoleTransition(initialRole: Role = 'super_admin') {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, setState] = useState<RoleTransitionState>({
    previousRole: null,
    currentRole: initialRole,
    impersonatedSchool: null,
    isImpersonating: false
  });

  const startImpersonation = useCallback(async (role: Role, school: School) => {
    try {
      // Here you would typically make an API call to validate the role transition
      // and get the appropriate permissions
      
      setState(prev => ({
        previousRole: prev.currentRole,
        currentRole: role,
        impersonatedSchool: school,
        isImpersonating: true
      }));

      // Store the impersonation state in session storage for persistence
      sessionStorage.setItem('roleTransition', JSON.stringify({
        previousRole: state.currentRole,
        currentRole: role,
        impersonatedSchool: school,
        isImpersonating: true
      }));

      showToast(`Now viewing as ${role} at ${school.name}`, { type: 'success' });

      // Redirect to the appropriate dashboard based on the role
      switch (role) {
        case 'principal':
          router.push(`/schools/${school.id}/principal-dashboard`);
          break;
        case 'teacher':
          router.push(`/schools/${school.id}/teacher-dashboard`);
          break;
        case 'admin':
          router.push(`/schools/${school.id}/admin-dashboard`);
          break;
        case 'coordinator':
          router.push(`/schools/${school.id}/coordinator-dashboard`);
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error) {
      showToast('Failed to switch roles', { type: 'error' });
      console.error('Role transition failed:', error);
    }
  }, [router, showToast, state.currentRole]);

  const endImpersonation = useCallback(async () => {
    try {
      // Here you would typically make an API call to end the impersonation session
      
      setState(prev => ({
        previousRole: null,
        currentRole: prev.previousRole || 'super_admin',
        impersonatedSchool: null,
        isImpersonating: false
      }));

      // Clear the impersonation state from session storage
      sessionStorage.removeItem('roleTransition');

      showToast('Returned to Super Admin view', { type: 'success' });
      router.push('/dashboard');
    } catch (error) {
      showToast('Failed to end impersonation', { type: 'error' });
      console.error('Failed to end impersonation:', error);
    }
  }, [router, showToast]);

  const checkPermission = useCallback((requiredRole: Role): boolean => {
    // Super admin has all permissions
    if (state.currentRole === 'super_admin') return true;

    // Check if the current role matches the required role
    return state.currentRole === requiredRole;
  }, [state.currentRole]);

  const getCurrentSchool = useCallback((): School | null => {
    return state.impersonatedSchool;
  }, [state.impersonatedSchool]);

  const restoreSession = useCallback(() => {
    const savedState = sessionStorage.getItem('roleTransition');
    if (savedState) {
      const parsedState = JSON.parse(savedState) as RoleTransitionState;
      setState(parsedState);
    }
  }, []);

  return {
    currentRole: state.currentRole,
    previousRole: state.previousRole,
    impersonatedSchool: state.impersonatedSchool,
    isImpersonating: state.isImpersonating,
    startImpersonation,
    endImpersonation,
    checkPermission,
    getCurrentSchool,
    restoreSession
  };
} 