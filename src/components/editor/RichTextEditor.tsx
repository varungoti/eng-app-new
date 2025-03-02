"use client"

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from './extensions'
import { Button } from "@/components/ui/button"
import {
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, ListChecks,
  Image as ImageIcon, Link as LinkIcon,
  Undo, Redo,
  Quote, Code as CodeIcon, 
  Table as TableIcon, 
  Minus,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Trash,
  Code2,
  Heading1, Heading2, Heading3,
  HighlighterIcon,
  Brackets,
  Type as TypographyIcon,
} from "lucide-react"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CharacterCount from '@tiptap/extension-character-count'
import { cn } from "@/lib/utils"

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, maxLength, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      ...extensions,
      ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : [])
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        onChange(html);
      } catch (error) {
        console.error('Editor update error:', error);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        ...(placeholder && { 'data-placeholder': placeholder })
      }
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  }

  const setFontFamily = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  }

  return (
    <div className={cn("border rounded-lg", className)}>
      <div className="border-b p-2 flex flex-wrap gap-2">
        {/* Text Style Controls */}
        <div className="flex gap-1">
          <Button
            title="Bold"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            title="Italic"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            title="Underline"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-active={editor.isActive('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            title="Strikethrough"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-active={editor.isActive('strike')}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            title="Subscript"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            data-active={editor.isActive('subscript')}
          >
            <SubscriptIcon className="h-4 w-4" />
          </Button>
          <Button
            title="Superscript"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            data-active={editor.isActive('superscript')}
          >
            <SuperscriptIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Font Controls */}
        <Select onValueChange={setFontSize}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {['8px', '10px', '12px', '14px', '16px', '20px', '24px', '32px'].map(size => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setFontFamily}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'].map(font => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Lists */}
        <div className="flex gap-1">
          <Button
            title="Bullet List"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            title="Ordered List"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-active={editor.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            title="Task List"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            data-active={editor.isActive('taskList')}
          >
            <ListChecks className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1">
          <Button
            title="Align Left"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            data-active={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            title="Align Center"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            data-active={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            title="Align Right"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            data-active={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            title="Align Justify"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            data-active={editor.isActive({ textAlign: 'justify' })}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        {/* Special Formatting */}
        <div className="flex gap-1">
          <Button
            title="Blockquote"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            data-active={editor.isActive('blockquote')}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            title="Code"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            data-active={editor.isActive('code')}
          >
            <CodeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Table */}
        <Button
          title="Table"
          variant="ghost"
          size="sm"
          onClick={addTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        {/* Media */}
        <div className="flex gap-1">
          <Button
            title="Image"
            variant="ghost"
            size="sm"
            onClick={addImage}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            title="Link"
            variant="ghost"
            size="sm"
            onClick={addLink}
            data-active={editor.isActive('link')}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <Button
            title="Undo"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            title="Redo"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Heading Levels */}
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              title={`Heading ${level}`}
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()}
              data-active={editor.isActive('heading', { level: level as 1 | 2 | 3 | 4 | 5 | 6 })}
            >
              {level === 1 && <Heading1 className="h-4 w-4" />}
              {level === 2 && <Heading2 className="h-4 w-4" />}
              {level === 3 && <Heading3 className="h-4 w-4" />}
            </Button>
          ))}
        </div>

        {/* Code Block */}
        <Button
          title="Code Block"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-active={editor.isActive('codeBlock')}
        >
          <Code2 className="h-4 w-4" />
        </Button>

        {/* Highlight */}
        <Button
          title="Highlight"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          data-active={editor.isActive('highlight')}
        >
          <HighlighterIcon className="h-4 w-4" />
        </Button>

        {/* Hard Break */}
        <Button
          title="Hard Break"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <Brackets className="h-4 w-4" />
        </Button>

        {/* Typography */}
        <Popover>
          <PopoverTrigger asChild>
            <Button title="Typography" variant="ghost" size="sm">
              <TypographyIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-1">
              <Button
                title="Hard Break"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => editor.chain().focus().setHardBreak().run()}
              >
                Hard Break
              </Button>
              <Button
                title="Smart Quotes"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => editor.commands.setTextSelection({ 
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from 
                })}
              >
                Smart Quotes
              </Button>
              <Button
                title="Em Dash"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => editor.commands.setTextSelection({ 
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from 
                })}
              >
                Em Dash
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          title="Clear Content"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().clearContent().run()}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent 
        editor={editor} 
        className={cn("p-4 min-h-[300px] prose prose-sm max-w-none", className)}
      />

      {maxLength && editor?.storage.characterCount.characters() !== undefined && (
        <div className="p-2 text-sm text-muted-foreground border-t">
          {editor.storage.characterCount.characters()}/{maxLength} characters
        </div>
      )}
    </div>
  )
} 