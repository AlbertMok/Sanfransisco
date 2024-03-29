import { HTMLSerializerWithOptions, HTMLSerializerWithTransform } from '@everynote/serializer/html'
import { List, Editor } from '@everynote/models'
import { UNORDERED_LIST_KEY } from '../constants'
import { UnorderedListTemplates } from '../template'
import { UnorderedList } from '../interfaces/unordered-list'

export interface UnorderedListHTMLSerializerWithOptions extends HTMLSerializerWithOptions {
  editor: Editor
}

export const withUnorderedListHTMLSerializerTransform: HTMLSerializerWithTransform<UnorderedListHTMLSerializerWithOptions> = (
  next,
  serializer,
  customOptions
) => {
  const { attributes: customAttributes, style: customStyle, editor } = customOptions
  return (node, options) => {
    const { attributes, style } = options ?? {}
    if (UnorderedList.isUnorderedList(node)) {
      const { currentNumber, template } = node
      const listTemplate = List.getTemplate(editor, UNORDERED_LIST_KEY, template || UnorderedListTemplates[0].key)
      const label = listTemplate?.render({ ...node, currentNumber: 1 })
      const type = typeof label === 'string' ? label?.replace(/\.$/, '').trim() : label?.type
      const pl = style?.paddingLeft ?? '0px'
      delete style?.paddingLeft
      return serializer.create(
        'ul',
        serializer.mergeOptions(node, attributes, { currentNumber, type }, customAttributes),
        serializer.mergeOptions(node, style, { marginLeft: pl }, customStyle),
        serializer.create('li', {}, {}, node.children.map((child) => serializer.transform(child)).join(''))
      )
    }
    return next(node, options)
  }
}
