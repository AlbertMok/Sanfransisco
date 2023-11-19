import create, { StoreApi, UseBoundStore } from 'zustand'
import { Editor, Range, Element, Path, Selection } from '@editablejs/models'
import { Editable } from './editable'

export interface DragStore {
  drag: {
    type: 'block' | 'text'

    /** 拖拽的开始位置  */
    from: Range | Path

    /** 拖拽到目标位置 */
    to: Selection | Path

    /** 拖拽的数据 */
    data: DataTransfer //DataTransfer 对象用于保存拖动并放下（drag and drop）过程中的数据。它可以保存一项或多项数据，这些数据项可以是一种或者多种数据类型

    /** 当前鼠标位置 */
    position: Record<'x' | 'y', number>
  } | null
}

const EDITOR_TO_DRAG_STORE = new WeakMap<Editor, UseBoundStore<StoreApi<DragStore>>>()

const getDragStore = (editor: Editor) => {
  let store = EDITOR_TO_DRAG_STORE.get(editor)
  if (!store) {
    store = create<DragStore>(() => ({ drag: null }))
    EDITOR_TO_DRAG_STORE.set(editor, store)
  }
  return store
}

/**
 * 拖拽相关状态操作
 */
export const Drag = {
  getStore: getDragStore,

  getDrag: (editor: Editor) => {
    const store = getDragStore(editor)
    const { drag } = store.getState()
    return drag
  },

  setDrag: (editor: Editor, drag: Partial<DragStore['drag']>) => {
    const store = getDragStore(editor)
    store.setState((state) => {
      return {
        drag: drag === null ? null : Object.assign({}, state.drag, drag),
      }
    })
  },

  clear: (editor: Editor) => {
    const store = getDragStore(editor)
    store.setState({ drag: null })
  },

  toBlockPath: (editor: Editor) => {
    const drag = Drag.getDrag(editor)
    if (!drag || drag.type !== 'block') return
    const { to, position } = drag
    if (!to) return
    const entry = Editor.above(editor, {
      at: Path.isPath(to) ? to : to.focus,
      match: (n) => Element.isElement(n),
      mode: 'lowest',
    })
    if (!entry) return
    const element = Editable.toDOMNode(editor, entry[0])
    const rect = element.getBoundingClientRect()
    const { y, height } = rect
    const { y: pY } = position
    if (pY > y + height / 2) {
      return Path.next(entry[1])
    } else {
      return entry[1]
    }
  },
}
