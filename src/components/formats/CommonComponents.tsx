
import * as Popover from '@radix-ui/react-popover';
import { Volume2, Mic } from 'lucide-react';

export const ListenButton: React.FC<{
  text: string;
  onListen: (text: string) => Promise<void>;
  isPlaying: boolean;
  className?: string;
}> = ({ text, onListen, isPlaying, className = "" }) => (
  <button 
    className={`rounded-2xl flex space-x-2 border dark:border-primary/30 border-primary/40 
      items-center text-left hover:shadow-md transition-all ${className}`}
    onClick={() => onListen(text)}
    disabled={isPlaying}
  >
    <div className="text-primary bg-primary/5 p-4 rounded-xl">
      <Volume2 className="h-6 w-6" />
    </div>
    {text && <p className="px-4">{text}</p>}
  </button>
);

export const SpeakButton: React.FC<{
  onSpeak: () => void;
  isListening: boolean;
  isProcessing: boolean;
  userAnswer?: string;
}> = ({ onSpeak, isListening, isProcessing, userAnswer }) => (
  <button 
    className="rounded-2xl flex space-x-2 border dark:border-primary/30 border-primary/40 
      items-center text-left hover:shadow-md transition-all"
    onClick={onSpeak}
    disabled={isListening || isProcessing}
  >
    <div className="text-primary bg-primary/5 p-4 rounded-xl">
      <Mic className="h-6 w-6" />
    </div>
    <div className="px-4">
      <p>{isListening ? "Listening..." : isProcessing ? "Processing..." : "Tap to speak"}</p>
      {userAnswer && <p className="text-sm text-gray-600">You said: {userAnswer}</p>}
    </div>
  </button>
);

export const QuestionContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">{title}</h2>
    {children}
  </div>
);

// Common Components
export const WordPopover = ({ word, definition, phonetic, onListen }) => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="inline-block hover:bg-primary/5 rounded px-1 
            transition-colors duration-200 cursor-pointer"
        >
          {word}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-lg 
            border dark:border-primary/30 border-primary/40
            animate-in fade-in-0 zoom-in-95"
        >
          <div className="space-y-2 w-64">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{word}</h3>
              <Popover.Close className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-4 w-4" />
              </Popover.Close>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{phonetic}</span>
              <button 
                onClick={() => onListen(word)}
                className="p-1 rounded-lg hover:bg-primary/10 text-primary"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm">{definition}</p>
          </div>
          <Popover.Arrow className="fill-white dark:fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
  
  export const InteractiveSentence = ({ text, dictionary, onListen }) => {
    const words = text.split(/(\s+)/);
    
    return (
      <p className="leading-relaxed">
        {words.map((word, index) => {
          const cleanWord = word.toLowerCase().replace(/[.,!?]$/, '');
          const wordInfo = dictionary[cleanWord];
          
          return wordInfo ? (
            <WordPopover
              key={index}
              word={word}
              definition={wordInfo.definition}
              phonetic={wordInfo.phonetic}
              onListen={onListen}
            />
          ) : (
            <span key={index}>{word}</span>
          );
        })}
      </p>
    );
  };
  