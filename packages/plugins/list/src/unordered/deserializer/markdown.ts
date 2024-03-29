import { MarkdownDeserializerWithTransform, MarkdownDeserializerPlugin } from '@everynote/deserializer'
import { Descendant, generateRandomKey } from '@everynote/models'
import { ListItem } from 'mdast'
import { UnorderedList } from '../interfaces/unordered-list'
import { generateId } from '@everynote/editor'

export const withUnorderedListMarkdownDeserializerTransform: MarkdownDeserializerWithTransform = (next, self) => {
  return (node, options = {}) => {
    const { type } = node
    if (type === 'list' && !node.ordered) {
      const key = generateRandomKey()
      // 用于存储 checked 不为 null 的列表项
      let checkedNotNullListItem: ListItem[] = []

      const children: Descendant[] = []
      // 将 checked 为 null 的列表项交给下一个插件处理
      const finishCheckedNotNullListItem = () => {
        if (checkedNotNullListItem.length > 0) {
          children.push(
            ...next(
              {
                ...node,
                children: checkedNotNullListItem,
              },
              options
            )
          )
          checkedNotNullListItem = []
        }
      }

      node.children.forEach((child, index) => {
        // 列表项的 checked 为 null 时，转换为无序列表
        if (child.checked === null) {
          finishCheckedNotNullListItem()
          children.push(
            UnorderedList.create({
              key,
              level: 0,
              currentNumber: 0,
              children: self.transform(child, options),
              id: generateId(),
            })
          )
        } else {
          // 列表项的 checked 不为 null 时，交给下一个插件处理
          checkedNotNullListItem.push(child)
        }
      })
      finishCheckedNotNullListItem()
      return children
    }
    return next(node, options)
  }
}

export const withUnorderedListMarkdownDeserializerPlugin: MarkdownDeserializerPlugin = {
  extensions: ['list'],
}
