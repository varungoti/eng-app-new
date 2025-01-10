import React, { useState } from 'react';
import { Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_PERMISSIONS, UserRole } from '../types/roles';
import { useError } from '../hooks/useError';
import { useRoleStore } from '../lib/auth/store';
import { logger } from '../lib/logger';

const UserRoleIndicator: React.FC = () => {
  const { user, changeRole, isTransitioning } = useAuth();
  const { addError } = useError();
  const [isOpen, setIsOpen] = useState(false);
  const currentRole = useRoleStore((state) => state.currentRole);

  const handleRoleChange = async (newRole: UserRole) => {
    if (!user || isTransitioning) return;
    
    try {
      setIsOpen(false); // Close dropdown immediately
      await changeRole(newRole);
      
      logger.info('Role change initiated', {
        context: { from: user.role, to: newRole },
        source: 'UserRoleIndicator'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change role';
      logger.error(message, {
        context: { error: err },
        source: 'UserRoleIndicator'
      });
      addError(message);
    }
  };

  if (!user) return null;

  const roleName = ROLE_PERMISSIONS[currentRole || user.role]?.name || user.role;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        <div
          onClick={() => !isTransitioning && setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-white/90 transition-colors ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        >
          <Shield className="h-4 w-4 text-indigo-600" />
          <div className="text-sm">
            <span className="text-gray-500">Logged in as </span>
            <span className="font-medium text-gray-900">{roleName}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {isTransitioning && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
          )}
        </div>

        {isOpen && !isTransitioning && (
          <>
            <div 
              className="fixed inset-0" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 overflow-hidden z-50">
              <div className="max-h-64 overflow-y-auto">
                {Object.entries(ROLE_PERMISSIONS).map(([role, details]) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role as UserRole)}
                    disabled={role === currentRole}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2
                      ${role === currentRole ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}
                      ${role === currentRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Shield className={`h-4 w-4 ${role === currentRole ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span>{details.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserRoleIndicator;