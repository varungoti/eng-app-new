"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, MessageCircle, Clock, Video, ImageIcon, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExercisePromptViewProps {
  prompt: {
    id: string;
    text: string;
    type: 'image' | 'video' | 'gif';
    media: string | null;
    narration: string | null;
    saytext: string | null;
    content?: {
      instructions?: string;
      writingPrompt?: string;
      speakingPrompt?: string;
    };
    metadata?: {
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
      estimatedTime?: number;
    };
  };
  index: number;
}

export function ExercisePromptView({ prompt, index }: ExercisePromptViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="relative overflow-hidden">
          {/* Floating badge with shine effect */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Badge 
              variant="outline" 
              className="bg-background/80 backdrop-blur-sm border-primary/20"
            >
              Exercise {index + 1}
            </Badge>
            {prompt.metadata?.difficulty && (
              <Badge 
                variant="outline" 
                className={cn(
                  "capitalize bg-background/80 backdrop-blur-sm",
                  prompt.metadata.difficulty === 'beginner' && "text-green-500 border-green-500/20",
                  prompt.metadata.difficulty === 'intermediate' && "text-yellow-500 border-yellow-500/20",
                  prompt.metadata.difficulty === 'advanced' && "text-red-500 border-red-500/20"
                )}
              >
                {prompt.metadata.difficulty}
              </Badge>
            )}
          </div>

          {/* Media Section */}
          {prompt.media && (
            <div className="relative rounded-lg overflow-hidden group/media">
              {prompt.type === 'image' && (
                <div className="relative h-[200px] overflow-hidden">
                  <img
                    src={prompt.media}
                    alt={prompt.text}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              {prompt.type === 'video' && (
                <div className="relative h-[200px]">
                  <video
                    src={prompt.media}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </div>
          )}

          {/* Title and Description */}
          <div className={cn("space-y-4", prompt.media && "mt-40")}>
            <CardTitle className="text-lg font-semibold leading-tight">
              {prompt.text}
            </CardTitle>
            {prompt.content?.instructions && (
              <CardDescription className="flex items-center gap-2 text-primary/80">
                <Lightbulb className="h-4 w-4" />
                {prompt.content.instructions}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Narration Section */}
          {prompt.narration && (
            <div className="relative p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Volume2 className="h-4 w-4" />
                <h4 className="font-medium">Narration:</h4>
              </div>
              <div className="text-muted-foreground">{prompt.narration}</div>
            </div>
          )}

          {/* Say Text Section */}
          {prompt.saytext && (
            <div className="relative p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/20 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <MessageCircle className="h-4 w-4" />
                <h4 className="font-medium">Say Text</h4>
              </div>
              <p className="text-muted-foreground">{prompt.saytext}</p>
            </div>
          )}

          {/* Writing/Speaking Prompts */}
          {(prompt.content?.writingPrompt || prompt.content?.speakingPrompt) && (
            <div className="grid gap-4">
              {prompt.content.writingPrompt && (
                <div className="p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm">
                  <h4 className="font-medium mb-2 text-primary">Writing Prompt</h4>
                  <p className="text-muted-foreground">{prompt.content.writingPrompt}</p>
                </div>
              )}
              {prompt.content.speakingPrompt && (
                <div className="p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm">
                  <h4 className="font-medium mb-2 text-primary">Speaking Prompt</h4>
                  <p className="text-muted-foreground">{prompt.content.speakingPrompt}</p>
                </div>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{prompt.metadata?.estimatedTime || 5} mins</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {prompt.type}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 