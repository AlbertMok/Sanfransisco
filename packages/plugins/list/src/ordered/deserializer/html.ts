import { HTMLDeserializerOptions, HTMLDeserializerWithTransform } from '@everynote/deserializer/html'
import { isDOMText, List, Descendant, Editor, generateRandomKey } from '@everynote/models'
import { ORDERED_LIST_KEY } from '../constants'

export interface OrderedListHTMLDeserializerOptions extends HTMLDeserializerOptions {
  editor: Editor
}

export const withOrderedListHTMLDeserializerTransform: HTMLDeserializerWithTransform<OrderedListHTMLDeserializerOptions> = (
  next,
  serializer,
  { editor }
) => {
  return (node, options = {}) => {
    const { element, text } = options
    const { parentElement } = node
    if (parentElement?.nodeName === 'OL') {
      let { start = 1 } = parentElement as HTMLOListElement
      const children = Array.from(parentElement.childNodes)
      const index = children.indexOf(node as ChildNode)
      if (index > 0) {
        start += index
      }
      const { nodeName } = node
      const lists: List[] = []
      const elId = parentElement.getAttribute('list-id')
      const key = elId || generateRandomKey()
      if (!elId) parentElement.setAttribute('list-id', key)

      if (isDOMText(node)) {
        lists.push({
          ...element,
          key,
          type: ORDERED_LIST_KEY,
          currentNumber: start,
          children: serializer.transform(node, { text }),
          level: 0,
        })
      } else if (nodeName === 'LI') {
        const addLevel = (list: List, level = 0) => {
          list.level = level + 1
          if (list.type === ORDERED_LIST_KEY) {
            list.key = key
          }
          List.setIndent(editor, list)
          list.children.forEach((child) => {
            if (editor.isList(child)) {
              addLevel(child, list.level)
            }
          })
        }
        const children: Descendant[] = []
        // 遍历 list 子节点
        let isAddList = false
        for (const child of node.childNodes) {
          const fragment = serializer.transform(child, { text })
          for (const f of fragment) {
            if (editor.isList(f)) {
              addLevel(f, f.level)
              lists.push(f)
              isAddList = true
            } else if (isAddList) {
              lists.push(f as any)
            } else {
              children.push(f)
            }
          }
        }
        lists.unshift({
          ...element,
          key,
          type: ORDERED_LIST_KEY,
          currentNumber: start,
          children,
          level: 0,
        })
      }
      return lists
    }
    return next(node, options)
  }
}
