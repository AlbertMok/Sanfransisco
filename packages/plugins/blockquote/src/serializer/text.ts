import { TextSerializerWithTransform } from '@everynote/serializer/text'
import { Blockquote } from '../interfaces/blockquote'

export const withBlockquoteTextSerializerTransform: TextSerializerWithTransform = (next, serializer) => {
  return (node) => {
    if (Blockquote.isBlockquote(node)) {
      return node.children.map((child) => serializer.transform(child)).join('\n')
    }
    return next(node)
  }
}
