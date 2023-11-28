import { Editor, Range, Element, Ancestor, Descendant } from '@editablejs/models'

import ElementComponent from '../components/element'
import TextComponent from '../components/text'
import { Editable } from '../plugin/editable'
import { useEditableStatic } from './use-editable'
import { NODE_TO_INDEX, NODE_TO_PARENT } from '../utils/weak-maps'
import { NodeSelectedContext } from './use-node-selected'
import { NodeFocusedContext } from './use-node-focused'
import { GridContext } from './use-grid'
import { PlaceholderRender } from '../plugin/placeholder'

/**
 * Render Children Element And Leaf ELement, Return the `children`:`Decesdant[]`.
 */
const useChildren = (props: { node: Ancestor; selection: Range | null; renderPlaceholder?: PlaceholderRender }) => {
  const { node, selection, renderPlaceholder } = props
  const editor = useEditableStatic() // 获取编辑器实例
  const path = Editable.findPath(editor, node) // 获取节点路径
  const children = [] // 存储子节点
  const isLeafBlock = Element.isElement(node) && !editor.isInline(node) && Editor.hasInlines(editor, node)

  // 遍历这个 node 的所有子节点，实际上，这个 node 指的就是编辑器,也就是，遍历编辑器的所有节点
  for (let i = 0; i < node.children.length; i++) {
    const p = path.concat(i)
    const n = node.children[i] as Descendant
    const key = Editable.findKey(editor, n)
    const range = Editor.range(editor, p)
    const sel = selection && Range.intersection(range, selection)
    const focused = selection && Range.includes(range, selection.anchor) && Range.includes(range, selection.focus)

    if (Element.isElement(n)) {
      const element = (
        // 当前是否选中该节点
        <NodeSelectedContext.Provider key={`selected-provider-${key.id}`} value={!!sel}>
          {/* 当前是否 focus 该节点 */}
          <NodeFocusedContext.Provider key={`focused-provider-${key.id}`} value={focused ?? false}>
            <ElementComponent element={n} key={key.id} selection={sel} renderPlaceholder={renderPlaceholder} />
          </NodeFocusedContext.Provider>
        </NodeSelectedContext.Provider>
      )

      // 如果是表格
      if (Editor.isGrid(editor, n)) {
        children.push(
          <GridContext.Provider key={`grid-provider-${key.id}`} value={n}>
            {element}
          </GridContext.Provider>
        )
      } else {
        // 不是表格，直接加入到children中
        children.push(element)
      }
    } else {
      children.push(
        <TextComponent
          renderPlaceholder={renderPlaceholder}
          key={key.id}
          isLast={isLeafBlock && i === node.children.length - 1}
          parent={node}
          text={n}
        />
      )
    }

    NODE_TO_INDEX.set(n, i)
    NODE_TO_PARENT.set(n, node)
  }

  return children
}

export default useChildren
