import { Editor, EditorNodesOptions, Element, Path } from '@everynote/models'

/**
 * get slate node by the match condition
 * @param editor
 * @param type
 * @returns
 */
export const getMatchedNode = (editor: Editor, options?: EditorNodesOptions<Element>) => {
  const { selection } = editor
  if (!selection) return false

  // get the first element of the nodeEntries from the result of query
  const nodes = Editor.nodes(editor, options)
  const [matchedEntry] = Array.from(nodes)
  return matchedEntry
}

/**
 * check if an element is the active type
 * @param editor
 * @param type
 * @returns
 */
export const isElementActive = (editor: Editor, type: string) =>
  !!getMatchedNode(editor, { match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === type })

/**
 * get slate node by slate path,if path is not given,the path will default to the current selection
 * @param editor
 * @param path
 * @param mode
 * @returns
 */
export const getElementByPath = (editor: Editor, path?: Path, mode: 'all' | 'highest' | 'lowest' = 'lowest'): any => {
  const nodeEntry = Array.from(
    Editor.nodes(editor, {
      match: (node) => Editor.isEditor(editor) && Element.isElement(node),
      at: path || editor.selection?.anchor.path,
      mode,
    })
  )[0]

  if (nodeEntry) return nodeEntry[0]

  return editor.children[0]
}
