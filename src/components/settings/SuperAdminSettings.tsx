"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Users, Key, Bell } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/useToast";

const permissionGroups = [
  {
    name: 'School Management',
    permissions: [
      { id: 'create_school', label: 'Create Schools' },
      { id: 'edit_school', label: 'Edit Schools' },
      { id: 'delete_school', label: 'Delete Schools' },
      { id: 'manage_branches', label: 'Manage Branches' }
    ]
  },
  {
    name: 'User Management',
    permissions: [
      { id: 'create_users', label: 'Create Users' },
      { id: 'edit_users', label: 'Edit Users' },
      { id: 'delete_users', label: 'Delete Users' },
      { id: 'assign_roles', label: 'Assign Roles' }
    ]
  },
  {
    name: 'System Settings',
    permissions: [
      { id: 'manage_settings', label: 'Manage Settings' },
      { id: 'view_logs', label: 'View System Logs' },
      { id: 'manage_integrations', label: 'Manage Integrations' },
      { id: 'backup_restore', label: 'Backup & Restore' }
    ]
  }
];

export function SuperAdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = React.useState({
    enableNotifications: true,
    enableAuditLog: true,
    enableMFA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const [rolePermissions, setRolePermissions] = React.useState<Record<string, boolean>>({});

  const handlePermissionChange = (permissionId: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save the settings
    showToast('Settings saved successfully', { type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-sm text-gray-500">Manage system-wide settings and permissions</p>
        </div>
        <Settings className="h-6 w-6 text-gray-400" />
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-gray-500">Track all system activities</p>
                </div>
                <Switch
                  checked={settings.enableAuditLog}
                  onCheckedChange={(checked: boolean) => handleSettingChange('enableAuditLog', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout (minutes)</Label>
                  <p className="text-sm text-gray-500">Automatic logout after inactivity</p>
                </div>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="p-6">
            <div className="space-y-6">
              {permissionGroups.map((group) => (
                <div key={group.name} className="space-y-4">
                  <h3 className="font-medium">{group.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between">
                        <Label htmlFor={permission.id}>{permission.label}</Label>
                        <Switch
                          id={permission.id}
                          checked={rolePermissions[permission.id]}
                          onCheckedChange={(checked: boolean) => handlePermissionChange(permission.id)}
                        />
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Multi-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require MFA for all admin users</p>
                </div>
                <Switch
                  checked={settings.enableMFA}
                  onCheckedChange={(checked: boolean) => handleSettingChange('enableMFA', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maximum Login Attempts</Label>
                  <p className="text-sm text-gray-500">Before account lockout</p>
                </div>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Notifications</Label>
                  <p className="text-sm text-gray-500">Enable system-wide notifications</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked: boolean) => handleSettingChange('enableNotifications', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
} 
