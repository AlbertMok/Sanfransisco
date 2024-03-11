import { MarkdownDeserializerWithTransform, MarkdownDeserializerPlugin } from '@everynote/deserializer'
import { Hr } from '../interfaces/hr'

export const withHrMarkdownDeserializerTransform: MarkdownDeserializerWithTransform = (next, self) => {
  return (node, options = {}) => {
    const { type } = node
    if (type === 'thematicBreak') {
      return [Hr.create()]
    }
    return next(node, options)
  }
}

export const withHrMarkdownDeserializerPlugin: MarkdownDeserializerPlugin = {
  extensions: ['thematicBreak'],
}
