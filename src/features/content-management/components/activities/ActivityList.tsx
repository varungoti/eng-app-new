import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, SaveStatus } from '../../api/types';
import { ActivityForm } from './ActivityForm';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityListProps {
  activities: Activity[];
  activitySaveStatuses: SaveStatus[];
  expandedActivity: number | null;
  onAddActivity: () => void;
  onUpdateActivity: (index: number, activity: Activity) => void;
  onRemoveActivity: (index: number) => void;
  onSaveActivity: (activity: Activity, index: number) => void;
  onExpandActivity: (index: number | null) => void;
  className?: string;
}

export const ActivityList = ({
  activities,
  activitySaveStatuses,
  expandedActivity,
  onAddActivity,
  onUpdateActivity,
  onRemoveActivity,
  onSaveActivity,
  onExpandActivity,
  className
}: ActivityListProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <CardHeader className="px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Activities
            </h3>
            <CardDescription className="mt-1">
              Add and manage activities for this lesson. Activities can include practice exercises, games, and interactive content.
            </CardDescription>
          </div>
          <Button
            onClick={onAddActivity}
            className="sm:self-start transition-all duration-200 hover:shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </CardHeader>

      {/* Activities List */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {activities.map((activity, index) => (
          <Card 
            key={activity.id} 
            className={cn(
              "relative border-l-4 transition-all duration-200",
              expandedActivity === index 
                ? "border-l-primary shadow-lg scale-[1.02]" 
                : "border-l-primary/40 hover:border-l-primary hover:shadow-md hover:scale-[1.01]"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-2 py-1 bg-primary/10 rounded-md text-sm font-semibold text-primary whitespace-nowrap">
                      Activity {index + 1}
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap capitalize">
                      {activity.type}
                    </Badge>
                    {activitySaveStatuses.find(s => s.id === activity.id)?.status === 'saved' && (
                      <Badge variant="secondary" className="animate-fade-in">Saved</Badge>
                    )}
                  </div>
                  {expandedActivity !== index && (
                    <div className="text-sm text-muted-foreground truncate mt-2 sm:mt-0">
                      {activity.title || 'No title'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onExpandActivity(expandedActivity === index ? null : index)}
                          className="hover:bg-primary/10 transition-colors"
                        >
                          {expandedActivity === index ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {expandedActivity === index ? 'Collapse' : 'Expand'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveActivity(index)}
                          className="hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete activity</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>

            {expandedActivity === index && (
              <CardContent className="animate-fade-in">
                <ActivityForm
                  activity={activity}
                  index={index}
                  onUpdate={(updatedActivity) => onUpdateActivity(index, updatedActivity)}
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => onSaveActivity(activity, index)}
                          disabled={activitySaveStatuses.find(s => s.id === activity.id)?.status === 'saving'}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {activitySaveStatuses.find(s => s.id === activity.id)?.status === 'saving' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Activity
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {`Status: ${activitySaveStatuses.find(s => s.id === activity.id)?.status || 'draft'}`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge variant={
                    activitySaveStatuses.find(s => s.id === activity.id)?.status === 'saved'
                      ? 'success'
                      : activitySaveStatuses.find(s => s.id === activity.id)?.status === 'error'
                        ? 'destructive'
                        : 'default'
                  } className="animate-fade-in">
                    {activitySaveStatuses.find(s => s.id === activity.id)?.status || 'draft'}
                  </Badge>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-muted">
          <div className="max-w-sm mx-auto space-y-3">
            <h3 className="text-lg font-semibold text-muted-foreground">No activities yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first activity. Activities help students practice and reinforce their learning.
            </p>
            <Button
              onClick={onAddActivity}
              className="mt-4 transition-all duration-200 hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Activity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};