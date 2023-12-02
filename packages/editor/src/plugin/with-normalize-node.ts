import { Editor, Transforms, Node, Path } from '@everynote/models'
import { Editable } from './editable'

export const withNormalizeNode = <T extends Editor>(editor: T) => {
  const e = editor as T & Editable

  const { normalizeNode } = editor
  e.normalizeNode = (entry) => {
    const [node, path] = entry

    if (Editor.isBlock(e, node)) {
      const { type, ...attributes } = node
      let isUnwrap = false
      const isParagraph = !type || type === 'paragraph'
      for (const [child, childPath] of Node.children(editor, path)) {
        if (Editor.isBlock(e, child)) {
          if (!isUnwrap && !isParagraph && child.type === type) {
            Transforms.unwrapNodes(editor, { at: childPath })
            return
          } else if (isParagraph) {
            Transforms.setNodes(editor, attributes, { at: childPath })
            isUnwrap = true
          }
        }
      }
      if (isUnwrap) {
        Transforms.unwrapNodes(editor, { at: path })
        return
      }
    }
    normalizeNode(entry)
  }

  return e
}
