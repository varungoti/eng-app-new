'use client';

import React from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { 
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  Warning,
  Spinner,
  Sun,
  Moon,
  Plus,
  PencilSimple,
  TrashSimple,
  FolderPlus,
  BookOpen,
  FileArrowUp,
  FileArrowDown,
  FileX,
  File,
  ArrowsClockwise,
  PlayCircle,
  Users,
  Calendar,
  GraduationCap,
  EyeSlash,
  Question,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  SpinnerBall,
  SquareLogo,
  Check,
  X,
} from '@phosphor-icons/react';
import { logger } from '@/lib/logger';

// Map icon names to Phosphor components
export const PhosphorIconMap = {
  'CHAT_SQUARE_TEXT': PhosphorIcons.SquareLogo,
  'CARET_UP': PhosphorIcons.CaretUp,
  'CARET_DOWN': PhosphorIcons.CaretDown,
  'CARET_LEFT': PhosphorIcons.CaretLeft,
  'CARET_RIGHT': PhosphorIcons.CaretRight,
  'LOCK_SIMPLE': PhosphorIcons.LockSimple,
  'WARNING': PhosphorIcons.Warning,
  'SPINNER': PhosphorIcons.Spinner,
  'SUN': PhosphorIcons.Sun,
  'MOON': PhosphorIcons.Moon,
  'PLUS': PhosphorIcons.Plus,
  'PENCIL_SIMPLE': PhosphorIcons.PencilSimple,
  'TRASH_SIMPLE': PhosphorIcons.TrashSimple,
  'FOLDERS_PLUS': PhosphorIcons.FolderPlus,
  'FOLDER_PLUS': PhosphorIcons.FolderPlus,
  'BOOK_OPEN': PhosphorIcons.BookOpen,
  'BOOKMARK': PhosphorIcons.Bookmark,
  'CLOCK_COUNTDOWN': PhosphorIcons.ClockCountdown,
  'ARROWS_CLOCKWISE': PhosphorIcons.ArrowsClockwise,
  'PLAY_CIRCLE': PhosphorIcons.PlayCircle,
  'USERS': PhosphorIcons.Users,
  'CALENDAR': PhosphorIcons.Calendar,
  'GRADUATION_CAP': PhosphorIcons.GraduationCap,
  'EYE_SLASH': PhosphorIcons.EyeSlash,
  'QUESTION': PhosphorIcons.Question,
  'CHEVRON_UP': PhosphorIcons.CaretUp,
  'CHEVRON_DOWN': PhosphorIcons.CaretDown,
  'CHEVRON_LEFT': PhosphorIcons.CaretLeft,
  'CHEVRON_RIGHT': PhosphorIcons.CaretRight,
  'FILE_ARROW_UP': PhosphorIcons.FileArrowUp,
  'FILE_ARROW_DOWN': PhosphorIcons.FileArrowDown,
  'FILE_X': PhosphorIcons.FileX,
  'FILE': PhosphorIcons.File,
  'ARROW_UP': PhosphorIcons.ArrowUp,
  'ARROW_DOWN': PhosphorIcons.ArrowDown,
  'ARROW_LEFT': PhosphorIcons.ArrowLeft,
  'ARROW_RIGHT': PhosphorIcons.ArrowRight,
  'SPINNER_BALL': PhosphorIcons.SpinnerBall,
  'CHECK': PhosphorIcons.Check,
  'X': PhosphorIcons.X,
 
} as const;

export type PhosphorIconName = keyof typeof PhosphorIconMap;

interface IconProps extends Omit<React.ComponentPropsWithoutRef<'svg'>, 'ref'> {
  type: 'phosphor';
  name: PhosphorIconName;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill';
  size?: number | string;
}

export function Icon({ 
  type, 
  name, 
  className, 
  size = 24,
  weight = 'regular',
  ...props 
}: IconProps): JSX.Element | null {
  try {
    const PhosphorIcon = PhosphorIconMap[name];
    if (!PhosphorIcon) {
      logger.warn(`Icon "${name}" not found`, {
        context: { name: name },
        source: 'Icon'
      });
      return null;
    }

    return (
      <PhosphorIcon 
        className={cn(className)}
        size={size}
        weight={weight}
        {...props}
      />
    );
  } catch (error) {
    console.warn(`Error rendering icon: ${error}`);
    return null;
  }
}

export default Icon;