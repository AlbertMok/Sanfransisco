import { MarkdownDeserializerWithTransform, MarkdownDeserializerPlugin } from '@everynote/deserializer/markdown'
import { Blockquote } from '../interfaces/blockquote'
import { generateId } from '@everynote/editor'

export const withBlockquoteMarkdownDeserializerTransform: MarkdownDeserializerWithTransform = (next, self) => {
  return (node, options = {}) => {
    const { type } = node
    if (type === 'blockquote') {
      let children = node.children.map((child) => self.transform(child, options)).flat()
      let id = generateId()
      return [Blockquote.create(children, id)]
    }
    return next(node, options)
  }
}

export const withBlockquoteMarkdownDeserializerPlugin: MarkdownDeserializerPlugin = {
  extensions: ['blockQuote'],
}
