export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'technical_head'
  | 'developer'
  | 'sales_head'
  | 'sales_lead'
  | 'sales_executive'
  | 'content_head'
  | 'content_editor'
  | 'accounts_head'
  | 'accounts_executive'
  | 'school_leader'
  | 'school_principal'
  | 'teacher_head'
  | 'teacher';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  [key: string]: {
    name: string;
    description: string;
    dashboardConfig?: {
      companyMetrics: boolean;
      financialMetrics: boolean;
      employeeMetrics: boolean;
      developmentMetrics: boolean;
      revenueMetrics: boolean;
    };
    permissions: {
      content: boolean;
      schools: boolean;
      staff: boolean;
      myclasses: boolean;
      schedule: boolean;
      settings: boolean;
      sales: boolean;
      accounts: boolean;
      reports: boolean;
      development?: boolean;
      infrastructure?: boolean;
      finance?: boolean;
      hr?: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
      view: boolean;
      content_management: boolean;
      content_editor: boolean;
    };
  };
}export const ROLE_PERMISSIONS: RolePermissions = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    dashboardConfig: {
      companyMetrics: true,
      financialMetrics: true,
      employeeMetrics: true,
      developmentMetrics: true,
      revenueMetrics: true
    },
    permissions: {
      content_management: true,
      content: true,
      content_editor: true,
      schools: true,
      staff: true,
      myclasses: true,
      schedule: true,
      settings: true,
      sales: true,
      accounts: true,
      reports: true,
      development: true,
      infrastructure: true,
      finance: true,
      hr: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      view: true,
    },
  },
  admin: {
    name: 'Admin',
    description: 'Administrative access with limited delete permissions',
    permissions: {
      content: true,
      content_management: true,
      content_editor: true,
      schools: true,
      staff: true,
      myclasses: true,
      schedule: true,
      settings: true,
      sales: true,
      accounts: true,
      reports: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
      view: true,
    },
  },
  technical_head: {
    name: 'Technical Head',
    description: 'Manages technical infrastructure and IT operations',
    permissions: {
      content: false,
      content_editor: false,
      schools: false,
      staff: true,
      myclasses: true,
      schedule: false,
      settings: true,
      sales: false,
      accounts: false,
      reports: true,
      development: true,
      infrastructure: true,
      finance: false,
      hr: false,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      view: true,
      content_management: false,
    },
  },
  developer: {
    name: 'Developer',
    description: 'Handles application development and maintenance',
    permissions: {
      content: false,
      content_editor: false,
      schools: false,
      staff: false,
      myclasses: true,
      schedule: false,
      settings: true,
      sales: false,
      accounts: false,
      reports: true,
      development: true,
      infrastructure: false,
      finance: false,
      hr: false,
      create: true,
      edit: true,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
  sales_head: {
    name: 'Sales Head',
    description: 'Manages sales team and operations',
    permissions: {
      content: false,
      content_editor: false,
      schools: true,
      staff: true,
      myclasses: true,
      schedule: false,
      settings: false,
      sales: true,
      accounts: false,
      reports: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
      view: true,
      content_management: false,
    },
  },
  sales_lead: {
    name: 'Sales Lead',
    description: 'Team lead for sales operations',
    permissions: {
      content: false,
      content_editor: false,
      schools: true,
      staff: false,
      myclasses: true,
      schedule: false,
      settings: false,
      sales: true,
      accounts: false,
      reports: true,
      create: true,
      edit: true,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
  sales_executive: {
    name: 'Sales Executive',
    description: 'Handles sales operations',
    permissions: {
      content: false,
      content_editor: false,
      schools: true,
      staff: false,
      myclasses: true,
      schedule: false,
      settings: false,
      sales: true,
      accounts: false,
      reports: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
  content_head: {
    name: 'Content Head',
    description: 'Manages content team and curriculum',
    permissions: {
      content_management: true,
      content: true,
      content_editor: true,
      schools: false,
      staff: true,
      myclasses: false,
      schedule: true,
      settings: false,
      sales: false,
      accounts: false,
      reports: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      view: true,
    },
  },
  content_editor: {
    name: 'Content Editor',
    description: 'Creates and edits content',
    permissions: {
      content_management: false,
      content: true,
      content_editor: true,
      schools: false,
      staff: false,
      myclasses: false,
      schedule: false,
      settings: false,
      sales: false,
      accounts: false,
      reports: false,
      create: true,
      edit: true,
      delete: false,
      approve: false,
      view: true,
    },
  },
  accounts_head: {
    name: 'Accounts Head',
    description: 'Manages accounting operations',
    permissions: {
      content: false,
      content_editor: false,
      schools: true,
      staff: false,
      myclasses: false,
      schedule: false,
      settings: false,
      sales: true,
      accounts: true,
      reports: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
      view: true,
      content_management: false,
    },
  },
  accounts_executive: {
    name: 'Accounts Executive',
    description: 'Handles accounting tasks',
    permissions: {
      content: false,
      content_editor: false,
      schools: true,
      staff: false,
      myclasses: false,
      schedule: false,
      settings: false,
      sales: false,
      accounts: true,
      reports: true,
      create: true,
      edit: false,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
  school_leader: {
    name: 'School Leader',
    description: 'Manages multiple schools',
    permissions: {
      content: true,
      content_editor: false,
      schools: true,
      staff: true,
      myclasses: true,
      schedule: true,
      settings: false,
      sales: false,
      accounts: false,
      reports: true,
      create: true,
      edit: true,
      delete: false,
      approve: true,
      view: true,
      content_management: false,
    },
  },
  school_principal: {
    name: 'School Principal',
    description: 'Manages a single school',
    permissions: {
      content: true,
      content_editor: false,
      schools: false,
      staff: true,
      myclasses: true,
      schedule: true,
      settings: false,
      sales: false,
      accounts: false,
      reports: true,
      create: false,
      edit: true,
      delete: false,
      approve: true,
      view: true,
      content_management: false,
    },
  },
  teacher_head: {
    name: 'Teacher Head',
    description: 'Leads teaching staff',
    permissions: {
      content: true,
      content_editor: false,
      schools: false,
      staff: true,
      myclasses: true,
      schedule: true,
      settings: false,
      sales: false,
      accounts: false,
      reports: true,
      create: false,
      edit: true,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
  teacher: {
    name: 'Teacher',
    description: 'Conducts classes and assessments',
    permissions: {
      content: true,
      content_editor: false,
      schools: false,
      staff: false,
      myclasses: true,
      schedule: true,
      settings: false,
      sales: false,
      accounts: false,
      reports: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      view: true,
      content_management: false,
    },
  },
};

export interface Permissions {
  content_management: boolean;
  content_editor: boolean;
}

export interface RoleSettings {
  id: string;
  role_key: string;
  settings: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

