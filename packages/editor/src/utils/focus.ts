import { Editor, Location, Transforms } from '@everynote/models'
import { Editable } from '../plugin/editable'

/**
 * Focus the editor. Extension:
 *
 * If `target` is defined:
 * - deselect the editor (otherwise it will focus the start of the editor)
 * - select the editor
 * - focus the editor
 */
export const focusEditor = <E extends Editor = Editor>(editor: E, target?: Location) => {
  if (target) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.deselect(editor)
      Transforms.select(editor, target)
    })
  }
  Editable.focus(editor as any)
}
