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
    };
  };
}

export const ROLE_PERMISSIONS: RolePermissions = {
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
      content: true,
      schools: true,
      staff: true,
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
      schools: true,
      staff: true,
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
      schools: false,
      staff: true,
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
    },
  },
  developer: {
    name: 'Developer',
    description: 'Handles application development and maintenance',
    permissions: {
      content: false,
      schools: false,
      staff: false,
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
    },
  },
  sales_head: {
    name: 'Sales Head',
    description: 'Manages sales team and operations',
    permissions: {
      content: false,
      schools: true,
      staff: true,
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
    },
  },
  sales_lead: {
    name: 'Sales Lead',
    description: 'Team lead for sales operations',
    permissions: {
      content: false,
      schools: true,
      staff: false,
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
    },
  },
  sales_executive: {
    name: 'Sales Executive',
    description: 'Handles sales operations',
    permissions: {
      content: false,
      schools: true,
      staff: false,
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
    },
  },
  content_head: {
    name: 'Content Head',
    description: 'Manages content team and curriculum',
    permissions: {
      content: true,
      schools: false,
      staff: true,
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
      content: true,
      schools: false,
      staff: false,
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
      schools: true,
      staff: false,
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
    },
  },
  accounts_executive: {
    name: 'Accounts Executive',
    description: 'Handles accounting tasks',
    permissions: {
      content: false,
      schools: true,
      staff: false,
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
    },
  },
  school_leader: {
    name: 'School Leader',
    description: 'Manages multiple schools',
    permissions: {
      content: true,
      schools: true,
      staff: true,
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
    },
  },
  school_principal: {
    name: 'School Principal',
    description: 'Manages a single school',
    permissions: {
      content: true,
      schools: false,
      staff: true,
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
    },
  },
  teacher_head: {
    name: 'Teacher Head',
    description: 'Leads teaching staff',
    permissions: {
      content: true,
      schools: false,
      staff: true,
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
    },
  },
  teacher: {
    name: 'Teacher',
    description: 'Conducts classes and assessments',
    permissions: {
      content: true,
      schools: false,
      staff: false,
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
    },
  },
};