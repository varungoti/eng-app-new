import StarterKit from '@tiptap/starter-kit'
import FontSize from '@tiptap/extension-font-size'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableBody from '@tiptap/extension-table'
import History from '@tiptap/extension-history'
import Strike from '@tiptap/extension-strike'
import Blockquote from '@tiptap/extension-blockquote'
import HardBreak from '@tiptap/extension-hard-break'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'

// Disable the table extension from StarterKit since we're adding it separately
const customStarterKit = StarterKit.configure({
  // Configure other StarterKit extensions as needed
  heading: {
    levels: [1, 2, 3]
  }
})

// Add custom table extensions instead
const tableExtensions = [
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'border-collapse table-auto',
    },
  }),
  TableRow,
  TableCell,
  TableHeader
]

// Configure other extensions
const otherExtensions = [
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline',
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Subscript,
  Superscript,
  Highlight.configure({
    multicolor: true,
  }),
  TextStyle,
  FontFamily,
  Color,
]

// Combine all extensions
export const extensions = [
  customStarterKit,
  ...tableExtensions,
  ...otherExtensions,
] as Extension[] 