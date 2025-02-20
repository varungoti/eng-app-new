import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RecommendationsPanelProps {
  recommendations: {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
  }[];
}

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{recommendation.title}</h3>
                <span className={cn(
                  "text-sm capitalize",
                  getDifficultyColor(recommendation.difficulty)
                )}>
                  {recommendation.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {recommendation.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {recommendation.topic}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recommendation.duration} mins
                  </span>
                </div>

                <Link href={`/learning/lesson/${recommendation.id}`}>
                  <Button variant="ghost" size="sm">
                    Start
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
} 