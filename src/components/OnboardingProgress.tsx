import React from 'react';
import { APP_ICONS } from '@/lib/constants/icons';
import type { OnboardingTask, OnboardingProgress as Progress } from '@/types/onboarding';
import { Icon } from '@/components/ui/icons';

interface OnboardingProgressProps {
  tasks: OnboardingTask[];
  progress: Progress[];
  onUpdateProgress: (taskId: string, status: Progress['status']) => void;
}

const statusIcons = {
  pending: APP_ICONS.CLOCK,
  in_progress: APP_ICONS.ALERT_TRIANGLE,
  completed: APP_ICONS.CHECK_CIRCLE,
  blocked: APP_ICONS.X_CIRCLE,
};

const statusColors = {
  pending: 'text-gray-400',
  in_progress: 'text-yellow-400',
  completed: 'text-green-400',
  blocked: 'text-red-400',
};

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  tasks,
  progress,
  onUpdateProgress,
}) => {
  const getTaskProgress = (taskId: string): Progress => {
    return progress.find((p) => p.taskId === taskId) || {
      id: `temp-${taskId}`,
      taskId,
      status: 'pending' as const,
      notes: '',
      schoolId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Onboarding Progress
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Complete these tasks to finish the onboarding process
        </p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const taskProgress = getTaskProgress(task.id);
            const StatusIcon = statusIcons[taskProgress.status];
            const statusColor = statusColors[taskProgress.status];

            return (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon 
                        name={statusIcons[taskProgress.status]}
                        className={`h-5 w-5 ${statusColor} mr-3 flex-shrink-0`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <select
                        value={taskProgress.status}
                        onChange={(e) =>
                          onUpdateProgress(task.id, e.target.value as Progress['status'])
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                  {taskProgress.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{taskProgress.notes}</p>
                    </div>
                  )}
                  {task.required && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OnboardingProgress;