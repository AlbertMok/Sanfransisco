import { TextSerializerWithTransform } from '@everynote/serializer/text'
import { CodeBlock } from '../interfaces/codeblock'

export const withCodeBlockTextSerializerTransform: TextSerializerWithTransform = (next, serializer) => {
  return (node) => {
    if (CodeBlock.isCodeBlock(node)) {
      return node.code + '\n'
    }
    return next(node)
  }
}
