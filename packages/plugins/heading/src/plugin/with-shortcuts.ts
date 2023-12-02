import { Editable, Hotkey } from '@everynote/editor'
import { Editor, Element, Range, Point, Transforms } from '@everynote/models'
import { HeadingType } from '../interfaces/heading'
import { HeadingEditor } from './heading-editor'

const findMatchedRange = (editor: Editor, at: Point, shortcuts: Record<string, HeadingType>) => {
  const block = Editor.above(editor, {
    at,
    match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
  })

  const path = block ? block[1] : []

  const start = Editor.start(editor, path)
  const range = { anchor: at, focus: start }
  const beforeText = Editor.string(editor, range)

  for (const key in shortcuts) {
    if (beforeText === key) {
      const start = Editor.start(editor, path)
      const end = Editor.end(editor, path)
      return {
        shortcut: key,
        range: {
          anchor: {
            path: start.path,
            offset: start.offset + key.length,
          },
          focus: end,
        },
        start,
        end,
      }
    }
  }
}
export const withShortcuts = (editor: Editable, shortcuts: Record<string, HeadingType>) => {
  const { onKeydown } = editor

  editor.onKeydown = (event) => {
    const { selection } = editor
    if (
      selection &&
      Range.isCollapsed(selection) &&
      !Editable.isComposing(editor) &&
      Hotkey.match('space', event) &&
      !HeadingEditor.queryActive(editor)
    ) {
      const anchor = Range.start(selection)
      const match = findMatchedRange(editor, anchor, shortcuts)
      if (match) {
        event.preventDefault()
        const { shortcut, range, start } = match
        const type = shortcuts[shortcut]
        const ref = Editor.rangeRef(editor, range)
        Transforms.delete(editor, {
          at: {
            anchor: start,
            focus: range.anchor,
          },
        })
        editor.selection = ref.unref()
        HeadingEditor.toggle(editor, type)
        Transforms.collapse(editor, { edge: 'start' })
        return
      }
    }
    onKeydown(event)
  }
}
