import React from 'react';
import { School, Users, Book, Activity, Map, BarChart } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { useSchools } from '../../hooks/useSchools';

interface SchoolLeaderDashboardProps {
  settings: RoleSettings;
}

const SchoolLeaderDashboard: React.FC<SchoolLeaderDashboardProps> = ({ settings }) => {
  const { schools, loading, error } = useSchools();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const totalStudents = schools.reduce((sum, school) => sum + (school.studentCount || 0), 0);
  const totalStaff = schools.reduce((sum, school) => sum + (school.staffCount || 0), 0);
  const totalClassrooms = schools.reduce((sum, school) => sum + (school.classroomCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Schools</p>
              <p className="text-2xl font-semibold text-gray-900">{schools.length}</p>
            </div>
            <School className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{totalStaff}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
              <p className="text-2xl font-semibold text-gray-900">{totalClassrooms}</p>
            </div>
            <Book className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* School Performance & Resource Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">School Performance</h3>
            <BarChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {schools.map((school) => (
              <div key={school.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{school.name}</p>
                  <p className="text-xs text-gray-500">
                    {school.studentCount} Students • {school.staffCount} Staff
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Resource Allocation</h3>
            <Map className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {schools.map((school) => (
              <div key={school.id} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{school.name}</p>
                  <p className="text-sm text-gray-500">{school.classroomCount} Classrooms</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(
                        100, 
                        ((school.studentCount || 0) / (school.capacity || 1)) * 100
                      )}%` 
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {school.studentCount} / {school.capacity} Students
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {schools.slice(0, 5).map((school) => (
            <div key={school.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {school.name} updated their staff roster
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Staff Update
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolLeaderDashboard;