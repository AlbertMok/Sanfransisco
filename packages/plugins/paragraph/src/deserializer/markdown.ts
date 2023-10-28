import { MarkdownDeserializerWithTransform, MarkdownDeserializerPlugin } from '@editablejs/deserializer/markdown'
import { Paragraph } from '../interfaces/paragraph'
import { generateId } from '@editablejs/editor'

export const withParagraphMarkdownDeserializerTransform: MarkdownDeserializerWithTransform = (next, self) => {
  return (node, options = {}) => {
    const { type } = node
    if (type === 'paragraph') {
      let children = node.children.map((child) => self.transform(child, options)).flat()
      let id = generateId()
      return [Paragraph.create(children, id)]
    }
    return next(node, options)
  }
}
