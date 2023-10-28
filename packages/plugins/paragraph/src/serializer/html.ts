import { HTMLSerializerWithTransform } from '@editablejs/serializer/html'
import { PARAGRAPH_KEY } from '../constants'
import { Paragraph } from '../interfaces/paragraph'

export const withBlockquoteHTMLSerializerTransform: HTMLSerializerWithTransform = (next, serializer, customOptions = {}) => {
  const { attributes: customAttributes, style: customStyle } = customOptions

  return (node, options) => {
    const { attributes, style } = options ?? {}

    if (Paragraph.isParagraph(node)) {
      return serializer.create(
        PARAGRAPH_KEY,
        serializer.mergeOptions(node, attributes, customAttributes),
        serializer.mergeOptions(node, style, customStyle),
        node.children.map((child) => serializer.transform(child)).join('')
      )
    }
    return next(node, options)
  }
}
