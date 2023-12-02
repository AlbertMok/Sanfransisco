import { Editable } from '@everynote/editor'
import { MarkEditor, MarkOptions, withMark } from '@everynote/plugin-mark'
import { FontSizeEditor, FontSizeOptions, withFontSize } from '@everynote/plugin-font/size'
import { FontColorEditor, FontColorOptions, withFontColor } from '@everynote/plugin-font/color'
import { BackgroundColorEditor, BackgroundColorOptions, withBackgroundColor } from '@everynote/plugin-font/background-color'
import { HeadingEditor, HeadingOptions, withHeading } from '@everynote/plugin-heading'
import { BlockquoteOptions, withBlockquote, BlockquoteEditor } from '@everynote/plugin-blockquote'
import { IndentEditor, IndentOptions, withIndent } from '@everynote/plugin-indent'
import {
  OrderedListOptions,
  withOrderedList,
  OrderedListEditor,
  UnorderedListOptions,
  withUnorderedList,
  UnorderedListEditor,
  TaskListOptions,
  withTaskList,
  TaskListEditor,
} from '@everynote/plugin-list'
import { TableOptions, TableEditor, withTable } from '@everynote/plugin-table'
import { LinkOptions, LinkEditor, withLink } from '@everynote/plugin-link'
import { ImageOptions, ImageEditor, withImage } from '@everynote/plugin-image'
import { HrOptions, HrEditor, withHr } from '@everynote/plugin-hr'
import { AlignOptions, AlignEditor, withAlign } from '@everynote/plugin-alignment'
import { LeadingOptions, LeadingEditor, withLeading } from '@everynote/plugin-leading'
import { MentionOptions, MentionEditor, withMention } from '@everynote/plugin-mention'
import { CodeBlockOptions, CodeBlockEditor, withCodeBlock } from '@everynote/plugin-codeblock'
import { ContextMenuEditor, ContextMenuOptions, withContextMenu } from '@everynote/plugin-context-menu'
import { ParagraphEditor, withParagraph } from '@everynote/plugin-paragraph'
import { TitleOptions, withTitle } from '@everynote/plugin-title'

export interface PluginOptions {
  contextMenu?: ContextMenuOptions
  mark?: MarkOptions
  fontSize?: FontSizeOptions
  fontColor?: FontColorOptions
  backgroundColor?: BackgroundColorOptions
  heading?: HeadingOptions
  blockquote?: BlockquoteOptions
  orderedList?: OrderedListOptions
  unorderedList?: UnorderedListOptions
  taskList?: TaskListOptions
  indent?: IndentOptions
  table?: TableOptions
  link?: LinkOptions
  image?: ImageOptions
  hr?: HrOptions
  align?: AlignOptions
  leading?: LeadingOptions
  mention?: MentionOptions
  codeBlock?: CodeBlockOptions
  title?: TitleOptions
}

export const withPlugins = <T extends Editable>(editor: T, options: PluginOptions = {}) => {
  let newEditor = withContextMenu(editor)
  editor = withTitle(editor, options.title)
  newEditor = withParagraph(newEditor, {})
  newEditor = withIndent(newEditor, options.indent)
  newEditor = withMark(newEditor, options.mark)
  newEditor = withFontSize(newEditor, options.fontSize)
  newEditor = withFontColor(newEditor, options.fontColor)
  newEditor = withBackgroundColor(newEditor, options.backgroundColor)
  newEditor = withHeading(newEditor, options.heading)
  newEditor = withBlockquote(newEditor, options.blockquote)
  newEditor = withOrderedList(newEditor, options.orderedList)
  newEditor = withUnorderedList(newEditor, options.unorderedList)
  newEditor = withTaskList(newEditor, options.taskList)
  newEditor = withTable(newEditor, options.table)
  newEditor = withLink(newEditor, options.link)
  newEditor = withImage(newEditor, options.image)
  newEditor = withHr(newEditor, options.hr)
  newEditor = withAlign(newEditor, options.align)
  newEditor = withLeading(newEditor, options.leading)
  newEditor = withMention(newEditor, options.mention)
  newEditor = withCodeBlock(newEditor, options.codeBlock)

  return newEditor as T &
    ContextMenuEditor &
    MarkEditor &
    HeadingEditor &
    FontSizeEditor &
    BlockquoteEditor &
    OrderedListEditor &
    IndentEditor &
    UnorderedListEditor &
    TaskListEditor &
    TableEditor &
    LinkEditor &
    ImageEditor &
    HrEditor &
    AlignEditor &
    LeadingEditor &
    FontColorEditor &
    BackgroundColorEditor &
    MentionEditor &
    CodeBlockEditor &
    ParagraphEditor
}

export * from '@everynote/plugin-mark'
export * from '@everynote/plugin-font/size'
export * from '@everynote/plugin-font/color'
export * from '@everynote/plugin-font/background-color'
export * from '@everynote/plugin-heading'
export * from '@everynote/plugin-blockquote'
export * from '@everynote/plugin-list'
export * from '@everynote/plugin-indent'
export * from '@everynote/plugin-table'
export * from '@everynote/plugin-context-menu'
export * from '@everynote/plugin-link'
export * from '@everynote/plugin-image'
export * from '@everynote/plugin-hr'
export * from '@everynote/plugin-alignment'
export * from '@everynote/plugin-leading'
export * from '@everynote/plugin-mention'
export * from '@everynote/plugin-codeblock'
export * from '@everynote/plugin-paragraph'
export * from '@everynote/plugin-title'
