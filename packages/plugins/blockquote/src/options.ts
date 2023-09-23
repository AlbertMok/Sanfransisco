import { Editor } from '@editablejs/models'

export type BlockquoteHotkey = string | ((e: KeyboardEvent) => boolean)
export interface BlockquoteOptions {
  hotkey?: BlockquoteHotkey
  shortcuts?: string[] | boolean
}

export const blockQuoteOptions = new WeakMap<Editor, BlockquoteOptions>()

export const getOptions = (editor: Editor): BlockquoteOptions => {
  return blockQuoteOptions.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: BlockquoteOptions) => {
  blockQuoteOptions.set(editor, options)
}
