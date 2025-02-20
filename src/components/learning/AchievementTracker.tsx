import { useEffect } from 'react';
import { checkAchievements } from '@/lib/api/achievements';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export function AchievementTracker({ userId }: { userId: string }) {
  const { toast } = useToast();

  useEffect(() => {
    const checkForNewAchievements = async () => {
      try {
        const newAchievements = await checkAchievements(userId);
        
        if (newAchievements.length > 0) {
          newAchievements.forEach(achievement => {
            toast({
              title: "New Achievement Unlocked! 🏆",
              description: achievement.title,
              action: (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  {achievement.description}
                </Badge>
              ),
            });
          });
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    // Check achievements on mount and periodically
    checkForNewAchievements();
    const interval = setInterval(checkForNewAchievements, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [userId, toast]);

  return null; // Utility component, no UI needed
} 