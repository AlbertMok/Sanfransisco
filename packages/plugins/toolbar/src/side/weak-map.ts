import { Path, Range, Element } from '@everynote/models'
import { Editable } from '@everynote/editor'

interface CapturedData {
  selection: Range
  path: Path
  element: Element
  isEmpty: boolean // 当前元素的内容是否为空
  isVoid: boolean //是否为空元素，即 link image hr br 这些不含有可编辑子元素的标签
}

const sideToolBarCapturedDataWeakMap = new WeakMap<Editable, CapturedData>()

/**
 *
 * @param editor
 * @returns 其中包含 selection:当前选区 path:叶子节点位置 element:选中的元素 isEmpty:选中的元素内容是否为空 isVoid:是否为无类型的元素
 */
export const getCapturedData = (editor: Editable): CapturedData | undefined => {
  return sideToolBarCapturedDataWeakMap.get(editor)
}

/**
 * 设置元素快照信息
 * @param editor
 * @param data 要设置的元素的快照信息
 */
export const setCapturedData = (editor: Editable, data: CapturedData) => {
  sideToolBarCapturedDataWeakMap.set(editor, data)
}

/**
 * 清空元素快照信息
 * @param editor
 */
export const clearCapturedData = (editor: Editable) => {
  sideToolBarCapturedDataWeakMap.delete(editor)
}
