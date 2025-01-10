import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { ROLE_PERMISSIONS, type UserRole } from '../types/roles';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const permissionCategories = {
  access: ['content', 'schools', 'staff', 'schedule', 'settings', 'sales', 'accounts', 'reports'],
  actions: ['create', 'edit', 'delete', 'approve', 'view']
} as const;

const RoleManagement: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Role Permissions
          </h3>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Detailed overview of permissions for each role in the system.
        </p>
      </div>

      <Accordion type="single" collapsible className="divide-y divide-gray-200">
        {Object.entries(ROLE_PERMISSIONS).map(([role, details]) => (
          <AccordionItem key={role} value={role}>
            <AccordionTrigger className="px-4 py-5 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-indigo-600">
                    {details.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">
                    {details.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 py-5 sm:px-6 space-y-6">
                {/* Access Permissions */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">
                    Access Permissions
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {permissionCategories.access.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {details.permissions[permission as keyof typeof details.permissions] ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className="capitalize">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Permissions */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">
                    Action Permissions
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {permissionCategories.actions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2 text-sm"
                      >
                        {details.permissions[permission as keyof typeof details.permissions] ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className="capitalize">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default RoleManagement;