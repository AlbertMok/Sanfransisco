import { Editable, Hotkey, generateId } from '@editablejs/editor'
import { Transforms, Editor, Path, Range, Node, Text } from '@editablejs/models'
import { BLOCKQUOTE_KEY } from '../constants'
import { BlockquoteHotkey, BlockquoteOptions, setOptions } from '../options'
import { BlockquoteEditor } from './blockquote-editor'
import { withShortcuts } from './with-shortcuts'

/**默认快捷键 */
const defaultHotkey: BlockquoteHotkey = 'mod+shift+u'

const defaultShortcuts: string[] = ['>', '|']

export const withBlockquote = <T extends Editable>(editor: T, options: BlockquoteOptions = {}) => {
  const newEditor = editor as T & BlockquoteEditor

  setOptions(newEditor, options)

  // 转化为blockquote
  newEditor.createBlockQuoteElement = () => {
    let id = generateId()
    editor.normalizeSelection((selection) => {
      if (editor.selection !== selection) editor.selection = selection

      if (BlockquoteEditor.isActive(editor)) {
        Transforms.unwrapNodes(editor, {
          match: (n) => Editor.isBlock(editor, n) && n.type === BLOCKQUOTE_KEY,
          split: true,
        })
      } else {
        Transforms.wrapNodes(
          editor,
          { type: BLOCKQUOTE_KEY, children: [], id },
          {
            mode: 'highest',
            match: (n) => Editor.isBlock(editor, n) && !editor.isGrid(n) && !editor.isGridRow(n) && !editor.isGridCell(n),
          }
        )
      }
    })
  }

  const { renderElement, normalizeNode } = newEditor

  newEditor.normalizeNode = (entry) => {
    const [node, path] = entry
    if (BlockquoteEditor.isBlockquote(newEditor, node)) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!Editor.isBlock(editor, child)) {
          Transforms.wrapNodes(editor, { type: 'paragraph', children: [] }, { at: childPath })
          return
        }
      }
    }
    return normalizeNode(entry)
  }

  newEditor.renderElement = ({ element, attributes, children }) => {
    if (BlockquoteEditor.isBlockquote(newEditor, element)) {
      return (
        <div {...attributes}>
          <blockquote tw="before:border-solid opacity-50 border-2 border-solid border-y-0 border-r-0 ">{children}</blockquote>
        </div>
      )
    }
    return renderElement({ attributes, children, element })
  }

  const hotkey = options.hotkey ?? defaultHotkey
  const { onKeydown } = newEditor

  newEditor.onKeydown = (e: KeyboardEvent) => {
    // 使用Hotkey.match函数检查当前按下的键盘事件e是否与定义的hotkey匹配
    const value = Hotkey.match(hotkey, e)
    if (value) {
      // 如果匹配，那么会阻止默认的键盘事件行为
      e.preventDefault()
      // 并调用 createBlockQuoteElement()
      newEditor.createBlockQuoteElement()
      return
    }

    // 检查editor的selection属性。如果以下任何条件成立，函数将不会进一步处理并直接调用onKeydown(e):即按下按键后没有任何效果
    // 当前没有选中的范围。选中的范围不是折叠的（即选择了多个字符）。当前编辑器中块引用不是活跃状态。用户按下了“Shift+Enter”组合键。
    const { selection } = editor
    if (!selection || !Range.isCollapsed(selection) || !BlockquoteEditor.isActive(newEditor) || Hotkey.match('shift+enter', e)) return onKeydown(e)

    // 如果用户在块引用中按下“Enter”键：
    if (Hotkey.match('enter', e)) {
      // 使用Editor.above函数查找当前选中位置上面的块级元素,即entry入口
      // 如果是块级元素并且不是void元素
      const entry = Editor.above(newEditor, { match: (n) => Editor.isBlock(newEditor, n) && !Editor.isVoid(newEditor, n) })
      if (entry) {
        const [block, path] = entry

        // parent 是调用 newEditor中的方法来寻找path上的父级元素
        const [parent, parentPath] = Editor.parent(newEditor, path)
        // // 如果找到块级元素，则进一步检查它是否为空，并且它的父元素是否为 块引用 元素。
        if (Editor.isEmpty(newEditor, block) && BlockquoteEditor.isBlockquote(editor, parent)) {
          e.preventDefault()

          // 如果块引用中 为空的内容，在按下 enter后，解除当前元素（光标所在处元素 的块引用状态
          if (parent.children.length === 1) {
            Transforms.unwrapNodes(newEditor, {
              at: parentPath,
            })
          } else {
            // 如果非空，即光标所在处是一个 块引用的元素，而且块引用不为空
            Transforms.moveNodes(newEditor, {
              at: path,
              to: Path.next(parentPath),
            })
          }
          return
        }
      }
    }
    onKeydown(e)
  }

  /** options的shorcuts */
  const { shortcuts } = options
  if (shortcuts !== false) {
    withShortcuts(newEditor, defaultShortcuts.concat(Array.isArray(shortcuts) ? shortcuts : []))
  }

  return newEditor
}
