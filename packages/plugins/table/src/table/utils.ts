import { Editable } from '@everynote/editor'
import { Editor } from '@everynote/models'

interface CalculateAverageColumnWidthInContainerOptions {
  cols: number
  minWidth?: number
  getWidth?: (width: number) => number
}

/**
 * 计算容器内平均列宽度
 * @param editor
 * @param options
 * @returns
 */
export function calculateAverageColumnWidthInContainer(editor: Editor, options: CalculateAverageColumnWidthInContainerOptions): number[] {
  const { minWidth = 10, cols, getWidth } = options

  // 获取编辑器容器DOM
  const container = Editable.toDOMNode(editor, editor)
  // 计算编辑器容器的位置
  const rect = container.getBoundingClientRect()
  // 计算容器的宽度
  const width = getWidth ? getWidth(rect.width) : 0
  // 计算每一列的宽度,根据列数平均分配宽度，确保每列宽度不小于最小列宽
  const colWidth = Math.max(minWidth, Math.floor(width / cols))

  const tableColsWdith = []
  let colsWidth = 0
  // 如果最后一列计算出的宽度与容器宽度有差异，调整最后一列宽度以填满容器
  for (let col = 0; col < cols; col++) {
    const cws = colsWidth + colWidth
    // 如果是最后一列,并且所有的列的宽度总和小于容器宽度
    if (col === cols - 1 && cws < width) {
      // 调整最后一列的宽度
      const cw = width - colsWidth
      colsWidth += cw
      tableColsWdith.push(cw)
    } else {
      colsWidth = cws
      tableColsWdith.push(colWidth)
    }
  }
  // 返回一个数组，包含每列的宽度
  return tableColsWdith
}

/**
 * 适应性地调整列宽度以适应容器宽度,用于在容器尺寸变化时适应性调整列宽度
 * @param editor
 * @param colsWidth
 * @param minWidth
 * @returns
 */
export function adaptiveExpandColumnWidthInContainer(editor: Editor, colsWidth: number[], minWidth = 5): number[] {
  const container = Editable.toDOMNode(editor, editor)

  const containerRect = container.getBoundingClientRect()

  const { width: containerWidth } = containerRect

  const widths = colsWidth.concat()

  let gridWidth = widths.reduce((a, b) => a + b, 0)

  while (gridWidth > containerWidth) {
    let minCount = 0
    for (let i = 0; i < widths.length; i++) {
      const w = widths[i]
      if (w > minWidth) {
        widths[i] = w - 1
        gridWidth--
        if (gridWidth <= containerWidth) break
      } else {
        minCount++
      }
    }
    if (minCount === widths.length) break
  }
  return widths
}
