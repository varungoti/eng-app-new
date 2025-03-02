import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSpeakerIcon from "@/components/common/speaker";
import { ImagePreview } from '../common/ImagePreview';

interface ExercisePromptProps {
  prompt: {
    text: string;
    saytext?: string;
    narration?: string;
    media?: string;
    type: string;
  };
  onComplete: (answer?: any) => void;
}

export function ExercisePrompt({ prompt, onComplete }: ExercisePromptProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNarration = async () => {
    if (prompt.narration) {
      setIsPlaying(true);
      // Add audio playback logic here
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsPlaying(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {prompt.narration && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleNarration}
              className="rounded-full"
            >
              <AnimatedSpeakerIcon isPlaying={isPlaying} />
            </Button>
          )}
          <p className="text-lg">{prompt.text}</p>
        </div>
        
        {prompt.media && (
          <div className="mb-4">
            <ImagePreview 
              imageUrl={prompt.media} 
              alt="Exercise media"
              className="rounded-lg max-w-full" 
            />
          </div>
        )}
        
        <Button onClick={() => onComplete({})} className="mt-4">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
} 