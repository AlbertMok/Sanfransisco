import create, { StoreApi, UseBoundStore } from 'zustand'
import { Selection, Range, Editor } from '@everynote/models'
import { getLineRectsByRange } from '../utils/selection'
import { Editable } from './editable'

/**
 * 基于文本的选择，而非基于块的选择
 * 选择绘制样式
 */
export interface SelectionDrawingStyle {
  /** 拖蓝聚焦颜色 */
  focusColor?: string

  /** 拖蓝失焦颜 */
  blurColor?: string

  /** 光标颜色 */
  caretColor?: string

  /** 光标宽度 */
  caretWidth?: number

  /** 拖拽光标的颜色 */
  dragColor?: string

  /** 触摸光标的颜色 */
  touchColor?: string

  /** 触摸光标的宽度 */
  touchWidth?: number
}

export interface SelectionDrawingStore {
  style: SelectionDrawingStyle
  selection: Selection | null
  enabled: boolean
}

const edtior_selectionDrawingStore_map = new WeakMap<Editor, UseBoundStore<StoreApi<SelectionDrawingStore>>>()

const getStore = (editor: Editor) => {
  let store = edtior_selectionDrawingStore_map.get(editor)
  if (!store) {
    store = create<SelectionDrawingStore>(() => ({
      style: {
        focusColor: 'rgba(0,127,255,0.3)',

        blurColor: 'rgba(136, 136, 136, 0.3)',

        caretColor: 'rgb(37, 99, 235)',

        caretWidth: 1.5,

        dragColor: 'rgb(37, 99, 235)',

        touchWidth: 2,

        touchColor: 'rgb(37, 99, 235)',
      },
      selection: null,
      rects: null,
      enabled: true,
    }))
    edtior_selectionDrawingStore_map.set(editor, store)
  }
  return store
}

export const SelectionDrawing = {
  getStore,

  setStyle: (editor: Editor, style: Partial<SelectionDrawingStyle>) => {
    const store = getStore(editor)
    store.setState((state) => ({ ...state, style }))
  },

  setSelection: (editor: Editor, selection: Selection | null) => {
    const store = getStore(editor)
    store.setState((state) => ({ ...state, selection }))
  },

  setEnabled: (editor: Editor, enabled: boolean) => {
    const store = getStore(editor)
    store.setState((state) => ({ ...state, enabled }))
  },

  toRects(editor: Editor, range: Range, relative = true) {
    let rects: DOMRect[] = []
    if (Range.isCollapsed(range)) {
      const domRange = Editable.toDOMRange(editor, range)
      const clientRects = domRange.getClientRects()
      if (clientRects.length > 1) {
        rects = [clientRects[clientRects.length - 1]]
      } else {
        rects = [domRange.getBoundingClientRect()]
      }
    } else {
      rects = getLineRectsByRange(editor, range)
    }

    return relative
      ? rects.map((r) => {
          const [x, y] = Editable.toRelativePosition(editor, r.left, r.top)
          r.x = x
          r.y = y
          return r
        })
      : rects
  },
}
