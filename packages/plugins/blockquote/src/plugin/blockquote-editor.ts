import { Editor } from '@everynote/models'
import { BLOCKQUOTE_KEY } from '../constants'
import { Blockquote } from '../interfaces/blockquote'
import { getOptions } from '../options'

export interface BlockquoteEditor extends Editor {
  createBlockQuoteElement: () => void
}

export const BlockquoteEditor = {
  isBlockquoteEditor: (editor: Editor): editor is BlockquoteEditor => {
    return !!(editor as BlockquoteEditor).createBlockQuoteElement
  },

  isBlockquote: (editor: Editor, node: any): node is Blockquote => {
    return Blockquote.isBlockquote(node)
  },

  isActive: (editor: Editor) => {
    const elements = Editor.elements(editor)
    return !!elements[BLOCKQUOTE_KEY]
  },

  getOptions,

  toggle: (editor: Editor) => {
    if (BlockquoteEditor.isBlockquoteEditor(editor)) editor.createBlockQuoteElement()
  },
}
