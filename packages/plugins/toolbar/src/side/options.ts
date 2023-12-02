import { Editable } from '@everynote/editor'
import { Editor, Node } from '@everynote/models'
import { SideToolbarLocale } from './locale'

export interface SideToolbarOptions {
  locale?: Record<string, SideToolbarLocale>
  delayHideDuration?: number
  delayDragDuration?: number
  horizontalDistanceThreshold?: number
  verticalDistanceThreshold?: number // 垂直距离入口
  match?: (node: Node) => boolean // 匹配的节点，只有匹配到才会显示
}

export const SIDE_TOOLBAR_OPTIONS = new WeakMap<Editor, SideToolbarOptions>()

export const getOptions = (editor: Editable): SideToolbarOptions => {
  return SIDE_TOOLBAR_OPTIONS.get(editor) || {}
}

export const setOptions = (editable: Editable, options: SideToolbarOptions): void => {
  SIDE_TOOLBAR_OPTIONS.set(editable, options)
}
