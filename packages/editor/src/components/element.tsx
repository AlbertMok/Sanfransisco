import * as React from 'react'
import getDirection from 'direction'
import { Editor, Node, Range, Element } from '@everynote/models'
import Text from './text'
import useChildren from '../hooks/use-children'
import { Editable, useEditableStatic, ElementAttributes, useBlockSelectable, useBlockSelectionHooks } from '..'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'
import { NODE_TO_ELEMENT, ELEMENT_TO_NODE, NODE_TO_PARENT, NODE_TO_INDEX, EDITOR_TO_KEY_TO_ELEMENT } from '../utils/weak-maps'
import { DATA_BLOCK_ID, DATA_BLOCK_TYPE, DATA_EDITABLE_INLINE, DATA_EDITABLE_NODE, DATA_EDITABLE_VOID } from '../utils/constants'
import { useElementDecorations } from '../hooks/use-decorate'
import { PlaceholderRender } from '../plugin/placeholder'
import { usePlaceholder } from '../hooks/use-placeholder'

/**
 * Element.
 */
const ElementRender = (props: { element: Element; selection: Range | null; renderPlaceholder?: PlaceholderRender }) => {
  const { element, selection, renderPlaceholder } = props

  const ref = React.useRef<HTMLElement>(null)

  const editor = useEditableStatic()

  const isInline = editor.isInline(element)

  const key = Editable.findKey(editor, element)

  const currentRenderPlaceholder = usePlaceholder(element)

  let children: React.ReactNode = useChildren({
    node: element,
    selection,
    renderPlaceholder: Editor.isEmpty(editor, element) ? currentRenderPlaceholder ?? renderPlaceholder : undefined,
  })

  // Attributes that the developer must mix into the element in their
  // custom node renderer component.
  // 基本元素,最外层
  const attributes: ElementAttributes = {
    [DATA_EDITABLE_NODE]: 'element',
    ref,
  }

  if (isInline) {
    attributes[DATA_EDITABLE_INLINE] = true
  }
  // If it's a block node with inline children, add the proper `dir` attribute
  // for text direction.
  if (!isInline && Editor.hasInlines(editor, element)) {
    const text = Node.string(element)
    const dir = getDirection(text)

    if (dir === 'rtl') {
      attributes.dir = dir
    }
  }

  // If it's a void node, wrap the children in extra void-specific elements.
  if (Editor.isVoid(editor, element)) {
    attributes[DATA_EDITABLE_VOID] = true
    const Tag = isInline ? 'span' : 'div'
    const [[text]] = Node.texts(element)

    children = (
      <Tag
        style={{
          height: '0',
          color: 'transparent',
          outline: 'none',
        }}
      >
        <Text renderPlaceholder={renderPlaceholder ?? currentRenderPlaceholder} isLast={false} parent={element} text={text} />
      </Tag>
    )

    NODE_TO_INDEX.set(text, 0)
    NODE_TO_PARENT.set(text, element)
  }

  useBlockSelectionHooks(editor)
  // Update element-related weak maps with the DOM element ref.
  useIsomorphicLayoutEffect(() => {
    const KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor)
    if (ref.current) {
      KEY_TO_ELEMENT?.set(key, ref.current)
      NODE_TO_ELEMENT.set(element, ref.current)
      ELEMENT_TO_NODE.set(ref.current, element)
    } else {
      KEY_TO_ELEMENT?.delete(key)
      NODE_TO_ELEMENT.delete(element)
    }
  })
  const path = Editable.findPath(editor, element)

  const newAttributes = editor.renderElementAttributes({ attributes, element })

  const _props = useBlockSelectable({ element })

  const attrProps = {
    [DATA_BLOCK_ID]: element.id,
    [DATA_BLOCK_TYPE]: element.type,
  }

  let content = (
    <div {...attrProps} {..._props} style={{ padding: '1px ', margin: '4px 0', minHeight: 'max-content' }}>
      {editor.renderElement({ attributes: newAttributes, children, element })}
    </div>
  )

  if (element.type === 'table' || element.type === 'table-row' || element.type === 'table-cell') {
    content = editor.renderElement({ attributes: newAttributes, children, element })
  }

  const decorates = useElementDecorations(element, path)

  if (decorates.length > 0) {
    content = decorates.reduceRight((children, decorate) => {
      return decorate.renderElement({ node: element, path, children })
    }, content)
  }

  return content
}

const MemoizedElement = React.memo(ElementRender, (prev, next) => {
  return (
    prev.element === next.element &&
    prev.renderPlaceholder === next.renderPlaceholder &&
    (prev.selection === next.selection || (!!prev.selection && !!next.selection && Range.equals(prev.selection, next.selection)))
  )
})

export default MemoizedElement
