// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Mic } from "lucide-react";

// interface SpeechToTextProps {
//   onResult: (result: string) => void;
//   isListening: boolean;
//   setIsListening: (isListening: boolean) => void;
// }

// const SpeechToText: React.FC<SpeechToTextProps> = ({ onResult, isListening, setIsListening }) => {
//   const startListening = () => {
//     setIsListening(true);
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.onresult = (event) => {
//       const last = event.results.length - 1;
//       const text = event.results[last][0].transcript;
//       onResult(text);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error', event.error);
//       setIsListening(false);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   return (
//     <Button onClick={startListening} disabled={isListening}>
//       <Mic className="mr-2 h-4 w-4" />
//       {isListening ? "Listening..." : "Speak"}
//     </Button>
//   );
// };

// export default SpeechToText;