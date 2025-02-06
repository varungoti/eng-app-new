import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementDisplayProps {
  achievements: {
    id: string;
    title: string;
    description: string;
    progress: number;
    isUnlocked: boolean;
    type: 'trophy' | 'star' | 'target' | 'award';
  }[];
}

export function AchievementsDisplay({ achievements }: AchievementDisplayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      default: return <Trophy className="h-6 w-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement) => (
        <Card 
          key={achievement.id}
          className={cn(
            "transition-all",
            achievement.isUnlocked && "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10"
          )}
        >
          <CardHeader className="flex flex-row items-center space-y-0 gap-4">
            <div className={cn(
              "p-2 rounded-full",
              achievement.isUnlocked ? "bg-yellow-500" : "bg-gray-200"
            )}>
              {getIcon(achievement.type)}
            </div>
            <CardTitle className="text-base">{achievement.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {achievement.description}
            </p>
            <Progress value={achievement.progress} className="h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 