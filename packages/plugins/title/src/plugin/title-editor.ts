import { Editor, Range } from '@everynote/models'
import { Title } from '../interfaces/title'

export interface TitleEditor extends Editor {}

export const TitleEditor = {
  isTitleEditor: (value: any): value is TitleEditor => {
    return Editor.isEditor(value)
  },

  isTitle: (editor: Editor, value: any): value is Title => {
    return Title.isTitle(value)
  },

  isFocused: (editor: Editor) => {
    const { selection } = editor
    if (!selection) return false
    const title = Editor.above(editor, {
      match: (n) => Title.isTitle(n),
    })
    if (!title) return false
    const range = Editor.range(editor, title[1])
    return Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)
  },
}
