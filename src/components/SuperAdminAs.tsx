"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Users, Settings, Activity, BarChart, UserPlus } from 'lucide-react';
import { useSchools } from '@/hooks/useSchools';
import LoadingSpinner from './LoadingSpinner';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SuperAdminAs = () => {
  const { schools, loading, error } = useSchools();
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [selectedSchool, setSelectedSchool] = React.useState<string>('');
  const [isImpersonating, setIsImpersonating] = React.useState(false);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const handleImpersonate = () => {
    if (selectedRole && selectedSchool) {
      setIsImpersonating(true);
      // Here you would typically make an API call to switch roles
      console.log(`Impersonating ${selectedRole} at school ${selectedSchool}`);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Super Admin Role Switcher</h1>
        <div className="flex items-center space-x-4">
          <Settings className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Role Selection</h3>
              <p className="text-sm text-gray-500">Choose a role to impersonate</p>
            </div>
            <UserPlus className="h-8 w-8 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Select Role</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">School Principal</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">School Admin</SelectItem>
                  <SelectItem value="coordinator">Department Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Select School</Label>
              <Select
                value={selectedSchool}
                onValueChange={setSelectedSchool}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={!selectedRole || !selectedSchool}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Switch Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Role Switch</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p>Are you sure you want to switch to the following role?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Role</Label>
                      <p className="mt-1 font-medium">{selectedRole}</p>
                    </div>
                    <div>
                      <Label>School</Label>
                      <p className="mt-1 font-medium">
                        {schools.find(s => s.id === selectedSchool)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Note: You will be impersonating this role and will have access to their permissions.
                      You can switch back to Super Admin at any time.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button onClick={handleImpersonate}>Confirm Switch</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {isImpersonating && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-900">
                  Currently Impersonating
                </h3>
                <p className="text-sm text-yellow-800">
                  {selectedRole} at {schools.find(s => s.id === selectedSchool)?.name}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-yellow-300 text-yellow-900 hover:bg-yellow-100"
              onClick={() => setIsImpersonating(false)}
            >
              Return to Super Admin
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Role Switches</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Switched to School Principal</p>
                    <p className="text-sm text-gray-500">
                      At Sample School {i} • 2 hours ago
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminAs; 