import { MarkdownSerializerWithTransform } from '@everynote/serializer/markdown'
import { ListItem } from 'mdast'
import { OrderedList } from '../interfaces/ordered-list'

export const withOrderedListMarkdownSerializerTransform: MarkdownSerializerWithTransform = (next, self) => {
  return (node, options = {}) => {
    if (OrderedList.isOrderedList(node)) {
      return [
        {
          type: 'list',
          ordered: true,
          start: node.currentNumber,
          children: [
            {
              type: 'listItem',
              children: node.children.map((child) => self.transform(child, options)).flat() as ListItem['children'],
            },
          ],
        },
      ]
    }
    return next(node, options)
  }
}
