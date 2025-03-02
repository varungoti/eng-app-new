"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School, Users, Settings, Activity, BarChart } from 'lucide-react';
import { useSchools } from '@/hooks/useSchools';
import LoadingSpinner from './LoadingSpinner';

const SuperAdmin = () => {
  const { schools, loading, error } = useSchools();

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

  const totalStudents = schools.reduce((sum, school) => sum + (school.capacity?.current || 0), 0);
  const totalStaff = schools.reduce((sum, school) => sum + (school.staffCount || 0), 0);
  const activeSchools = schools.filter(school => school.status === 'active').length;

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Settings className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <School className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Schools</p>
              <h3 className="text-2xl font-bold">{schools.length}</h3>
              <p className="text-sm text-green-600">{activeSchools} Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
              <p className="text-sm text-green-600">Across all schools</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <h3 className="text-2xl font-bold">{totalStaff}</h3>
              <p className="text-sm text-purple-600">Teaching & Non-teaching</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <h3 className="text-2xl font-bold">98%</h3>
              <p className="text-sm text-orange-600">All systems operational</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">School Performance</h3>
                <BarChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {schools.slice(0, 5).map((school) => (
                  <div key={school.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-gray-500">
                        {school.capacity?.current} Students
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full bg-green-500 rounded-full w-[${Math.min(
                            100,
                            ((school.capacity?.current || 0) /
                              (school.capacity?.total || 1)) *
                              100
                          )}%]`}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(
                          ((school.capacity?.current || 0) /
                            (school.capacity?.total || 1)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Recent Activities</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {schools.slice(0, 5).map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {school.name} updated their profile
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Update
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schools">
          <Card className="p-6">
            <div className="space-y-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{school.name}</h4>
                    <p className="text-sm text-gray-500">{school.address}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        school.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {school.status}
                    </span>
                    <button 
                      aria-label="Settings"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">User Management</h3>
              <p className="text-gray-500">
                Manage system users, roles, and permissions
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="p-6">
            <div className="text-center py-8">
              <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">System Reports</h3>
              <p className="text-gray-500">
                View and generate system-wide reports
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdmin; 