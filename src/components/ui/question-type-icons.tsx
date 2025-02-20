import { LucideIcon } from "lucide-react";
import {
  Circle,
  CheckSquare,
  AlignJustify,
  FileText,
  Hash,
  Image,
  Video,
  BarChart2,
  Grid,
  Star,
  Info,
  MessageCircle,
  Mic,
  BookOpen,
  Users,
  Play,
  Eye,
  Film,
  MessageSquare,
  Presentation,
  Book,
  Type,
  SplitSquareHorizontal,
  Shuffle,
  Edit3,
} from "lucide-react";

export const QuestionTypeIcons: Record<string, LucideIcon> = {
  // Existing types from image
  singleChoice: Circle,
  multipleChoice: CheckSquare,
  likertScale: AlignJustify,
  openQuestion: FileText,
  numberOpenQuestion: Hash,
  pictureChoice: Image,
  audioVideo: Video,
  ranking: BarChart2,
  pictureGallery: Grid,
  matrixQuestion: Grid,
  heatmap: Grid,
  starRating: Star,
  information: Info,
  
  // Additional question types
  speaking: Mic,
  storytelling: MessageCircle,
  listening: Play,
  listenAndRepeat: Video,
  grammarSpeaking: Type,
  idiomPractice: MessageSquare,
  reading: BookOpen,
  writing: Edit3,
  speakingAndWriting: MessageCircle,
  speakingAndListening: Mic,
  readingAndSpeaking: BookOpen,
  speakingWithAPartner: Users,
  lookAndSpeak: Eye,
  watchAndSpeak: Film,
  debate: MessageSquare,
  presentation: Presentation,
  vocabularyAndSpeaking: Book,
  vocabularyAndWordlist: Book,
  sentenceFormation: Type,
  sentenceTransformation: Shuffle,
  sentenceCompletion: SplitSquareHorizontal,
  sentenceTransformationAndCompletion: Shuffle,
  objectAndSpeaking: Eye,
  objectActionAndSpeaking: Play,
};

interface QuestionTypeIconProps {
  type: string;
  className?: string;
  size?: number;
}

export function QuestionTypeIcon({ type, className, size = 24 }: QuestionTypeIconProps) {
  const Icon = QuestionTypeIcons[type] || Info;
  return <Icon className={className} size={size} />;
} 