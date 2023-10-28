import { Editable, generateId } from '@editablejs/editor'
import { Editor, Element, Path, Transforms } from '@editablejs/models'
import { Paragraph } from '../interfaces/paragraph'
import cloneDeep from 'lodash.clonedeep'
import { PARAGRAPH_KEY } from '../constants'

export interface ParagraphEditor extends Editor {
  /** create a paragraph element in editor. */
  createParagraphElement: (type?: typeof PARAGRAPH_KEY) => void

  /** Insert a block break at the current selection. If the selection is currently expanded, delete it first. */
  insertBreak: () => void
}

export const ParagraphEditor = {
  isParagraphEditor: (editor: Editor): editor is ParagraphEditor => {
    return !!(editor as ParagraphEditor).createParagraphElement
  },

  isParagraph: (element: any): element is Paragraph => {
    return Paragraph.isParagraph(element)
  },
}

export const withParagraph = <T extends Editable>(editor: T, options = {}) => {
  const newEditor = editor as T & ParagraphEditor

  newEditor.createParagraphElement = () => {
    let id = generateId()
    const { selection } = editor
    if (selection) {
      // type NodeEntry<T extends Node = Node> = [T, Path],
      const nodeEntry = Editor.above<Element>(editor, {
        match: (n) => !Editor.isEditor(n),
        mode: 'lowest',
      })

      const isDefaultNode = nodeEntry && nodeEntry[0].type !== PARAGRAPH_KEY

      // create a new Paragraph
      const newParagraph = { type: 'paragraph', children: [{ text: '' }], id }

      //获取当前光标所在位置的anchor
      const parentPath = Path.parent(selection.anchor.path)
      // Get the text string content of a location.
      const text = Editor.string(editor, parentPath)
      if (isDefaultNode && text.length === 0) {
        Transforms.setNodes(editor, newParagraph, { at: parentPath })
        return
      }

      // 如果光标是在一个节点的最开头位置，并按下enter之后,当前节点下移的话，需要把当前节点删除，然后深复制，然后在下面插入
      const isStart = Editor.isStart(editor, selection.anchor, parentPath)
      if (isDefaultNode && isStart) {
        const [currentNode] = nodeEntry
        Transforms.setNodes(editor, newParagraph, { at: parentPath })
        Transforms.delete(editor, { unit: 'block' })
        Transforms.insertNodes(editor, cloneDeep(currentNode), { at: Path.next(parentPath) })

        // 移动光标到被下移动的节点的开头
        Transforms.select(editor, { path: [Path.next(selection.anchor.path)[0] + 1, 0], offset: 0 })
        return
      }

      Transforms.splitNodes(editor, { always: true })
      Transforms.setNodes(editor, newParagraph)
      return
    }
    return
  }

  newEditor.insertBreak = () => {
    newEditor.createParagraphElement()
  }

  // 渲染paragraph元素
  const { renderElement } = newEditor
  newEditor.renderElement = ({ element, attributes, children }) => {
    if (ParagraphEditor.isParagraph(element)) {
      return <div {...attributes}>{children}</div>
    }
    return renderElement({ attributes, children, element })
  }

  return newEditor
}
