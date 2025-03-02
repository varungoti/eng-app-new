import React from 'react';
import { Book, Users, Activity, BarChart } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface ContentHeadDashboardProps {
  settings: RoleSettings;
}

const ContentHeadDashboard: React.FC<ContentHeadDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
            <Book className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teachers</p>
              <p className="text-2xl font-semibold text-gray-900">85</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Usage</p>
              <p className="text-2xl font-semibold text-gray-900">92%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Engagement</p>
              <p className="text-2xl font-semibold text-gray-900">88%</p>
            </div>
            <BarChart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Content Progress & Teacher Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Progress</h3>
          <div className="space-y-4">
            {['Grade 1', 'Grade 2', 'Grade 3'].map((grade) => (
              <div key={grade} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{grade}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    {(() => {
                      const width = Math.floor(Math.random() * 100);
                      return (
                        <div 
                          className={`bg-indigo-600 h-2 rounded-full w-[${width}%]`}
                        />
                      );
                    })()}
                  </div>
                </div>
                <span className="text-sm font-medium text-indigo-600">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Teacher Performance</h3>
          <div className="space-y-4">
            {['Content Creation', 'Lesson Delivery', 'Student Engagement'].map((metric) => (
              <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{metric}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    {(() => {
                      const width = Math.floor(Math.random() * 100);
                      return (
                        <div 
                          className={`bg-green-600 h-2 rounded-full w-[${width}%]`}
                        />
                      );
                    })()}
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Content Updates</h3>
        <div className="space-y-4">
          {[
            { title: 'New Grammar Module', type: 'Addition', date: '2h ago' },
            { title: 'Vocabulary Section', type: 'Update', date: '4h ago' },
            { title: 'Speaking Exercise', type: 'Review', date: '6h ago' },
          ].map((update, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{update.title}</p>
                  <p className="text-xs text-gray-500">{update.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                update.type === 'Addition' ? 'bg-green-100 text-green-800' :
                update.type === 'Update' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {update.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentHeadDashboard;