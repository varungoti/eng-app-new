import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface FlashCard {
  id: string;
  front: string;
  back: string;
}

interface QuickQuiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function RevisionTools() {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizzes, setQuizzes] = useState<QuickQuiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleFlashcardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => 
      prev + 1 >= flashcards.length ? 0 : prev + 1
    );
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="quickquiz">Quick Quiz</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>

      <TabsContent value="flashcards">
        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {flashcards[currentCardIndex] && (
                <motion.div
                  key={flashcards[currentCardIndex].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-[200px]"
                >
                  <div
                    className="cursor-pointer p-6 text-center"
                    onClick={handleFlashcardFlip}
                  >
                    {isFlipped
                      ? flashcards[currentCardIndex].back
                      : flashcards[currentCardIndex].front}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handleFlashcardFlip}>
                Flip
              </Button>
              <Button onClick={handleNextCard}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="quickquiz">
        <Card>
          <CardContent className="pt-6">
            {quizzes[currentQuizIndex] && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  {quizzes[currentQuizIndex].question}
                </h3>
                <div className="space-y-2">
                  {quizzes[currentQuizIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleQuizAnswer(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle>Review Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Flashcards</h4>
                  <p className="text-sm text-muted-foreground">
                    {flashcards.length} cards available
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Quick Quiz</h4>
                  <p className="text-sm text-muted-foreground">
                    {quizzes.length} questions available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 