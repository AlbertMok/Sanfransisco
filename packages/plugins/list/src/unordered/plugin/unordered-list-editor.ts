import { Editor, List } from '@editablejs/models'
import { UnorderedList } from '../interfaces/unordered-list'
import { UNORDERED_LIST_KEY } from '../constants'
import { getOptions } from '../options'

export interface ToggleUnorderedListOptions {
  template?: string
}

export interface UnorderedListEditor extends Editor {
  createUnorderedList: (options?: ToggleUnorderedListOptions) => void
}

export const UnorderedListEditor = {
  // 如果 createUnorderedList 存在（即非 null 或 undefined），则表达式的结果为 true,editor为UnorderedListEditor类型；否则为 false
  isUnorderedListEditor: (editor: Editor): editor is UnorderedListEditor => {
    return !!(editor as UnorderedListEditor).createUnorderedList
  },

  isUnorderedList: (editor: Editor, value: any): value is UnorderedList => {
    return UnorderedList.isUnorderedList(value)
  },

  getOptions,

  queryActive: (editor: Editor) => {
    const elements = List.lists(editor, { match: (n) => n.type === UNORDERED_LIST_KEY })
    return elements.length > 0 ? elements : null
  },

  toggle: (editor: Editor, options?: ToggleUnorderedListOptions) => {
    // 调用create
    if (UnorderedListEditor.isUnorderedListEditor(editor)) editor.createUnorderedList(options)
  },
}
