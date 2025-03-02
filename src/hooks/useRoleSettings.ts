import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

export interface RoleSettings {
  // General preferences
  defaultView: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  
  // Notification settings
  notifications: {
    email: boolean;
    push: boolean;
    systemAlerts?: boolean;
    lessonReminders?: boolean;
    studentProgress?: boolean;
    assessmentResults?: boolean;
    adminAnnouncements?: boolean;
    [key: string]: boolean | undefined;
  };
  
  // Content access permissions
  contentAccess: {
    canCreateContent: boolean;
    canEditContent: boolean;
    canDeleteContent: boolean;
    canPublishContent: boolean;
    canReviewContent: boolean;
    visibleGrades: string[]; // IDs of grades accessible to this role
    restrictedTopics?: string[]; // Topics that should be restricted
  };
  
  // User management permissions
  userManagement: {
    canCreateUsers: boolean;
    canEditUsers: boolean;
    canDeleteUsers: boolean;
    canAssignRoles: boolean;
    canViewStudentData: boolean;
    canManageClasses: boolean;
    userAccessLevel: 'none' | 'limited' | 'full';
  };
  
  // Reports and analytics
  reports: string[];
  analytics: {
    canAccessAnalytics: boolean;
    availableDashboards: string[];
    exportFormats: ('pdf' | 'excel' | 'csv')[];
    scheduledReports: boolean;
  };
  
  // Dashboard configuration
  dashboardConfig: {
    quickStats: string[];
    charts: string[];
    recentActivities: boolean;
    notifications: boolean;
    upcomingLessons: boolean;
    studentProgress: boolean;
    [key: string]: any;
  };
  
  // Learning features
  learningFeatures: {
    aiAssistant: boolean;
    pronunciationTrainer: boolean;
    instantFeedback: boolean;
    gameBasedLearning: boolean;
    collaborativeExercises: boolean;
  };
  
  // Communication tools
  communicationTools: {
    inAppChat: boolean;
    canMessageStudents: boolean;
    canMessageParents: boolean;
    canMessageTeachers: boolean;
    canSendAnnouncements: boolean;
  };
  
  // System settings
  systemAccess: {
    canAccessSettings: boolean;
    canConfigureSystem: boolean;
    canViewLogs: boolean;
    canManageIntegrations: boolean;
    canManageSchoolProfile: boolean;
  };
  
  testData?: Record<string, any>;
}

export const useRoleSettings = (role: string) => {
  const [settings, setSettings] = useState<RoleSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('role_settings')
          .select('settings')
          .eq('role_key', role)
          .maybeSingle(); // Use maybeSingle() instead of single()

        if (fetchError) {
          throw fetchError;
        }

        const defaultSettings: RoleSettings = {
          defaultView: 'dashboard',
          theme: 'system',
          language: 'en',
          notifications: { 
            email: true, 
            push: true, 
            systemAlerts: true,
            lessonReminders: true,
            studentProgress: true,
            assessmentResults: true,
            adminAnnouncements: true
          },
          contentAccess: {
            canCreateContent: role === 'ADMIN' || role === 'TEACHER',
            canEditContent: role === 'ADMIN' || role === 'TEACHER',
            canDeleteContent: role === 'ADMIN',
            canPublishContent: role === 'ADMIN' || role === 'TEACHER',
            canReviewContent: role === 'ADMIN' || role === 'TEACHER',
            visibleGrades: [],
            restrictedTopics: []
          },
          userManagement: {
            canCreateUsers: role === 'ADMIN',
            canEditUsers: role === 'ADMIN',
            canDeleteUsers: role === 'ADMIN',
            canAssignRoles: role === 'ADMIN',
            canViewStudentData: role === 'ADMIN' || role === 'TEACHER',
            canManageClasses: role === 'ADMIN' || role === 'TEACHER',
            userAccessLevel: role === 'ADMIN' ? 'full' : (role === 'TEACHER' ? 'limited' : 'none')
          },
          reports: [],
          analytics: {
            canAccessAnalytics: role === 'ADMIN' || role === 'TEACHER',
            availableDashboards: ['overview', 'students', 'progress'],
            exportFormats: ['pdf', 'excel', 'csv'],
            scheduledReports: role === 'ADMIN'
          },
          dashboardConfig: {
            quickStats: [],
            charts: [],
            recentActivities: true,
            notifications: true,
            upcomingLessons: true,
            studentProgress: true
          },
          learningFeatures: {
            aiAssistant: true,
            pronunciationTrainer: true,
            instantFeedback: true,
            gameBasedLearning: true,
            collaborativeExercises: role !== 'STUDENT' ? false : true
          },
          communicationTools: {
            inAppChat: role !== 'STUDENT',
            canMessageStudents: role === 'ADMIN' || role === 'TEACHER',
            canMessageParents: role === 'ADMIN' || role === 'TEACHER',
            canMessageTeachers: role === 'ADMIN' || role === 'STUDENT',
            canSendAnnouncements: role === 'ADMIN'
          },
          systemAccess: {
            canAccessSettings: role === 'ADMIN',
            canConfigureSystem: role === 'ADMIN',
            canViewLogs: role === 'ADMIN',
            canManageIntegrations: role === 'ADMIN',
            canManageSchoolProfile: role === 'ADMIN'
          }
        };

        setSettings(data?.settings || defaultSettings);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load role settings';
        logger.error(message, {
          context: { error: err, role },
          source: 'useRoleSettings'
        });
        setError(message);
        // Set default settings even on error
        setSettings({
          defaultView: 'dashboard',
          theme: 'system',
          language: 'en',
          notifications: { 
            email: true, 
            push: true 
          },
          contentAccess: {
            canCreateContent: false,
            canEditContent: false,
            canDeleteContent: false,
            canPublishContent: false,
            canReviewContent: false,
            visibleGrades: [],
          },
          userManagement: {
            canCreateUsers: false,
            canEditUsers: false,
            canDeleteUsers: false,
            canAssignRoles: false,
            canViewStudentData: false,
            canManageClasses: false,
            userAccessLevel: 'none'
          },
          reports: [],
          analytics: {
            canAccessAnalytics: false,
            availableDashboards: [],
            exportFormats: ['pdf'],
            scheduledReports: false
          },
          dashboardConfig: {
            quickStats: [],
            charts: [],
            recentActivities: true,
            notifications: true,
            upcomingLessons: false,
            studentProgress: false
          },
          learningFeatures: {
            aiAssistant: false,
            pronunciationTrainer: false,
            instantFeedback: false,
            gameBasedLearning: false,
            collaborativeExercises: false
          },
          communicationTools: {
            inAppChat: false,
            canMessageStudents: false,
            canMessageParents: false,
            canMessageTeachers: false,
            canSendAnnouncements: false
          },
          systemAccess: {
            canAccessSettings: false,
            canConfigureSystem: false,
            canViewLogs: false,
            canManageIntegrations: false,
            canManageSchoolProfile: false
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [role]);

  return { settings, loading, error };
};

// Add default settings type and value
interface DefaultSettings {
  // Add your default settings structure here
  canManageUsers?: boolean;
  canManageRoles?: boolean;
  // ... other settings
}

const _defaultSettings: DefaultSettings = {
  canManageUsers: false,
  canManageRoles: false,
  // ... other default settings
};