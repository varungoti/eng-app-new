"use client";

import React, { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorConfig } from 'ckeditor5/src/core';
import { Button } from '@/components/ui/button';

const LICENSE_KEY = 'your-license-key';

interface EditorProps {
  value?: string;
  onChange?: (data: string) => void;
  initialData?: string;
  placeholder?: string;
  onSave?: (content: string) => Promise<void>;
  onClose?: () => void;
}

const RichTextEditor = ({ value, onChange, initialData, placeholder, onSave, onClose }: EditorProps) => {
  const wordCountRef = useRef<HTMLDivElement>(null);

  const handleEditorReady = (editor: any) => {
    if (wordCountRef.current) {
      const wordCount = editor.plugins.get('WordCount');
      wordCountRef.current.appendChild(wordCount.wordCountContainer);
    }
  };

  const editorConfig = {
    licenseKey: LICENSE_KEY,
    toolbar: {
      items: [
        'heading',
        '|',
        'fontFamily',
        'fontSize',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        '|',
        'alignment',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
        '|',
        'link',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        '|',
        'code',
        'codeBlock',
        'specialCharacters',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'linkImage'
      ],
      upload: {
        types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties'
      ]
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
      ]
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    fontSize: {
      options: ['tiny', 'small', 'default', 'big', 'huge']
    },
    link: {
      defaultProtocol: 'https://',
      addTargetToExternalLinks: true
    },
    placeholder: placeholder || 'Start typing...'
  };

  return (
    <div className="w-full">
      <div className="relative min-h-[300px] w-full border rounded-lg bg-background">
        <CKEditor
          editor={ClassicEditor}
          data={value || initialData}
          config={editorConfig as EditorConfig}
          onReady={handleEditorReady}
          onChange={(_, editor) => {
            const data = editor.getData();
            onChange?.(data);
          }}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={async () => {
              const editorElement = document.querySelector('#editor') as HTMLElement;
              const editor = await ClassicEditor.create(editorElement);
              const content = editor.getData();
              await onSave?.(content);
              onClose?.();
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
      <div ref={wordCountRef} className="mt-2 text-sm text-gray-500" />
    </div>
  );
};

export default RichTextEditor;
