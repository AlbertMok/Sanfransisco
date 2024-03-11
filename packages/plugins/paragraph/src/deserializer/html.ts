import { HTMLDeserializerWithTransform } from '@everynote/deserializer'
import { PARAGRAPH_KEY } from '../constants'

export const withParagraphHTMLDeserializerTransform: HTMLDeserializerWithTransform = (next, serializer) => {
  return (node, options = {}) => {
    const { element, text } = options
    if (node.nodeName.toLowerCase() === PARAGRAPH_KEY) {
      const children = []
      for (const child of node.childNodes) {
        children.push(...serializer.transform(child, { text }))
      }
      return [{ ...element, type: PARAGRAPH_KEY, children }]
    }
    return next(node, options)
  }
}
