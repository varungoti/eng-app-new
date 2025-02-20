/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Heart, 
  X,
  Volume2,
  Mic,
  RefreshCw,
  Volume,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import OpenAI from "openai";
import { motion, AnimatePresence } from "framer-motion";

// // Import the lesson data and utility functions
import { calculateNextReviewDate } from "@/utils/spacedRepetition";
import { saveProgress, getProgress } from "@/utils/progressTracking";
import Image from "next/image";
import { API } from "@/services/api";
import { useExercise } from "@/hooks/useApiQueries";

interface Exercise {
  questions: any[];
}

interface LessonData {
  exercises: Exercise[];
}

interface LessonProgressProps {
  lessonData: LessonData;
  currentExercise: number;
  currentQuestion: number;
}


export default function LessonPage() {
  const [lessonDataList, setLessonDataList] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();
  const {exercise} = params;

  const { data: exerciseData, isLoading } = useExercise(exercise as string);

  console.log(exerciseData, "exerciseData")
  useEffect(() => {
    if (params.lesson) {
      console.log("11111111111111111111111111", lesson);
      const fetchLessonData = async () => {
        try {
          const data = await API.getSubLessonData(lesson, subLesson);
          setLessonDataList(data);
        } catch (err) {
          console.log("Failed to fetch lesson data");
        }
      };
      fetchLessonData();
    }
  }, [params.lesson]);

  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [hearts, setHearts] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [correctStreak, setCorrectStreak] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [difficultQuestions, setDifficultQuestions] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [openai, setOpenai] = useState<OpenAI | null>(null);
  // @ts-ignore
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const [playingStatus, setPlayingStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const [wordFeedback, setWordFeedback] = useState<{ [key: string]: string }>(
    {}
  );
  const [activeButton, setActiveButton] = useState<{
    word: string;
    type: "listen" | "speak";
  } | null>(null);
 
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

 

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      // @ts-ignore
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
    }

    speechSynthesis.current = window.speechSynthesis;

    const loadedProgress = getProgress(params.id);
    setProgress(loadedProgress);
    if (loadedProgress) {
      setCurrentExercise(loadedProgress.currentExercise);
      setCurrentQuestion(loadedProgress.currentQuestion);
      setScore(loadedProgress.score);
    }

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [params.id]);

   
  // Add these state variables at the top with your other state declarations
  const [ttsProvider, setTtsProvider] = useState<"elevenlabs" | "browser">(
    "browser"
  );
  const ELEVENLABS_API_KEY =
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
    "sk_5362d35a4119bf9474cd26b4d6294007718609bc1a5705dc";
  const ELEVENLABS_VOICE_ID =
    process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || "pFZP5JQG7iQjIQuC4Bku";

  const handleSpeech = async (text: string): Promise<void> => {
    if (ttsProvider === "elevenlabs") {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_monolingual_v1",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("ElevenLabs API request failed");
        }

        const audioBlob = await response.blob();
        return new Promise((resolve, reject) => {
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.onended = () => {
            URL.revokeObjectURL(audio.src); // Clean up
            resolve();
          };
          audio.onerror = (error) => {
            URL.revokeObjectURL(audio.src);
            reject(error);
          };
          audio.play().catch(reject);
        });
      } catch (error) {
        console.error("ElevenLabs TTS error:", error);
        // Fallback to browser TTS
        return browserTTS(text);
      }
    } else {
      return browserTTS(text);
    }
  };

  // Helper function for browser TTS
  const browserTTS = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (speechSynthesis.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => resolve();
        speechSynthesis.current.speak(utterance);
      } else {
        resolve();
      }
    });
  };
 

  const handleListenClick = async (textOrObject: string | any) => {
    if (isPlaying) return;

    setIsPlaying(true);

    try {
      let textToSpeak: string;

      if (typeof textOrObject === "string") {
        textToSpeak = textOrObject;
      } else if (typeof textOrObject === "object") {
        // Determine which property to use based on the object structure
        if ("content" in textOrObject) {
          textToSpeak = textOrObject.content;
        } else if ("prompt" in textOrObject) {
          textToSpeak = textOrObject.prompt;
        } else if ("text" in textOrObject) {
          textToSpeak = textOrObject.text;
        } else if ("sampleAnswer" in textOrObject) {
          textToSpeak = textOrObject.sampleAnswer;
        } else {
          throw new Error("Unable to determine text to speak from object");
        }
      } else {
        throw new Error("Invalid input type");
      }

      await handleSpeech(textToSpeak);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsPlaying(false);
    }
  };
 
  const handleNext = () => {
    // Stop any ongoing speech synthesis
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }

    // Stop any ongoing audio playback
    if (isPlaying) {
      setIsPlaying(false);
      // If you have a reference to the Audio object, stop it here
      // For example: audioRef.current.pause();
    }

    // Reset listening and processing states
    setIsListening(false);
    setIsProcessing(false);

    setFeedback("");
    setUserAnswer("");

    if (isReviewMode) {
      if (difficultQuestions.length > 1) {
        setDifficultQuestions(difficultQuestions.slice(1));
      } else {
        setIsReviewMode(false);
        handleLessonComplete();
      }
    } else if (currentQuestion + 1 < lessonDataList?.questions?.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentExercise + 1 < lessonDataList.length) {
      setCurrentExercise(currentExercise + 1);
      setCurrentQuestion(0);
    } else {
      handleLessonComplete();
    }

    saveProgress(params.id, {
      currentExercise,
      currentQuestion: currentQuestion + 1,
      score,
      difficultQuestions,
    });
  };

  const handlePrevious = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }

    if (isPlaying) {
      setIsPlaying(false);
      // Stop audio playback here if needed
    }

    setIsListening(false);
    setIsProcessing(false);
    setFeedback("");
    setUserAnswer("");

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setCurrentQuestion(lessonDataList?.questions.length - 1);
    }
  };

  const handleLessonComplete = () => {
    if (difficultQuestions.length > 0 && !isReviewMode) {
      setIsReviewMode(true);
    } else {
      setIsLessonComplete(true);
    }
  };

  const getCurrentQuestion = () => {
    return isReviewMode
      ? difficultQuestions[0]
      : lessonDataList?.questions?.[currentQuestion];
  };

  const renderQuestion = (question: any) => {
    if (!question || typeof question !== "object") {
      console.error("Invalid question object:", question);
      return (
        <div className="space-y-4">
          <p className="text-xl font-bold">Error: Invalid Question Data</p>
          <p className="text-lg">
            The question data is invalid or missing. Please contact support.
          </p>
        </div>
      );
    }

    // console.log('Current question:', question); // Add this line for debugging

    switch (question.type) {
      case "speaking":
      case "repeat":
      case "vocabulary_word_list":
        return renderVocabularyWordListQuestion(question);
      default:
        console.error("Unsupported question type:", question.type);
        return (
          <div className="space-y-4">
            <p className="text-xl font-bold">
              Unsupported Question Type: {question.type}
            </p>
            <p className="text-lg">
              This question type is not supported. Please contact support.
            </p>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(question, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const handleWordSpeak = async (word: string) => {
    setIsListening(true);

    if (speechRecognition.current) {
      speechRecognition.current.start();
      speechRecognition.current.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        await checkWordPronunciation(word, spokenText);
      };

      speechRecognition.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  };

  const renderVocabularyWordListQuestion = (question: any) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Vocabulary Practice</h2>

      <div className="grid gap-4">
        {question.wordList.map((word: any, index: number) => (
          <div
            key={index}
            className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40 
              shadow-[0px_4px_0px_rgba(0,0,0,0.25)]
              dark:shadow-[0px_4px_0px_rgba(255,255,255,0.5)]"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{word.term}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {word.definition}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {word?.correctPronunciation}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-3 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 
                    transition-colors duration-200"
                  onClick={() => handleListenClick(word.term)}
                  disabled={playingStatus[word.term]}
                >
                  {playingStatus[word.term] ? (
                    <Volume className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>

                <button
                  className="p-3 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 
                    transition-colors duration-200"
                  onClick={() => handleWordSpeak(word.term)}
                  disabled={isListening || isProcessing}
                >
                  <Mic className="h-6 w-6" />
                </button>
              </div>
            </div>

            {wordFeedback[word.term] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 p-4 rounded-lg ${
                  wordFeedback[word.term]
                    .toLowerCase()
                    .includes("correctness: yes")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {wordFeedback[word.term]}
                </pre>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
 

  const currentQuestionData = getCurrentQuestion();

 
  const currentQuestionNumber = currentQuestion + 1;

  const totalQuestions = lessonDataList?.questions?.length;

  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  if (isLessonComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Lesson Completed!</h1>
          <p className="text-xl mb-4">Your final score: {score} points</p>
          <p className="text-lg mb-4">Hearts remaining: {hearts}</p>
          <Button
            onClick={() => router.push("/teacher/lessons")}
            className="mt-4"
          >
            Back to Lessons
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[100vh] bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex flex-col h-screen justify-between   mx-auto space-y-6 overflow-auto ">
        {/* Top Section */}

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white  top-0 z-10 dark:bg-gray-900 p-4 justify-center self-center max-w-7xl w-[90%] pt-8 "
        >
          <div className="flex items-center space-x-4">
            <Link href="/teacher/lessons" className="text-primary/60">
              <X className="h-6 w-6" />
            </Link>
            <Progress value={progressPercentage} className="w-[90%] h-4" />
            <div className="flex">
              {currentQuestionNumber} / {totalQuestions}
            </div>
          </div>

          <div className="flex justify-between items-center my-2 px-8">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {showHeartAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute"
                  >
                    <Heart className="text-red-500 h-8 w-8" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Heart
                className={`h-6 w-6 ${
                  hearts > 0 ? "text-red-500" : "text-gray-300"
                }`}
              />
              <span className="font-bold">{hearts}</span>
              {/* <div className="text-right">
            Score: {score}
          </div> */}
            </div>
          </div>
        </motion.div>

        {/* Middle Section - Centered Vertically */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className=" flex-grow flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4"
          >
            <div className="p-4 sm:p-8 rounded-lg w-full">
              <h1 className="text-2xl font-bold mb-4">
                {isReviewMode ? "Review Mode" : lessonDataList?.title}
              </h1>
              {renderQuestion(currentQuestionData)} 
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 w-full z-10 rounded-xl overflow-auto 
                  "
                  >
                    <h3 className="font-bold text-lg mb-2">Feedback:</h3>
                    <pre
                      className={`text-lg w-full whitespace-pre-wrap font-mono  p-4 
                      rounded-2xl flex space-x-2   items-center text-left 
                  shadow-[0px_4px_0px_rgba(0,0,0,0.25)]
                  dark:shadow-[0px_4px_0px_rgba(255,255,255,0.5)]
                  hover:shadow-[0px_2px_0px_rgba(0,0,0,0.25)]
                  dark:hover:shadow-[0px_2px_0px_rgba(255,255,255,0.5)]
                  hover:translate-y-[2px]
                  transition-all duration-200 ease-in-out
                  relative
                      ${
                        feedback.toLowerCase().includes("correctness: yes")
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {feedback}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white  sticky bottom-0 dark:bg-gray-900 border-t pb-4 border-gray-300 dark:border-gray-700 flex justify-center"
        >
          <div className="p-4 self-center w-[90%] max-w-7xl bottom flex justify-between">
            <Button
              className="py-8 px-10 h-14 justify-center flex self-center"
              onClick={handlePrevious}
              disabled={currentExercise === 0 && currentQuestion === 0}
            >
              Previous
            </Button>
            {isReviewMode && (
              <Button onClick={() => setIsReviewMode(false)}>
                <RefreshCw className="mr-2 h-4 w-4" /> End Review
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="py-8 px-10 h-14 justify-center flex self-center"
            >
              Next
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
