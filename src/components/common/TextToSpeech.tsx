import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

const TextToSpeech = ({ text }: { text: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Button onClick={handleSpeak} disabled={isPlaying}>
      <Volume2 className="mr-2 h-4 w-4" /> 
      {isPlaying ? "Playing..." : "Listen"}
    </Button>
  );
};

export default TextToSpeech;