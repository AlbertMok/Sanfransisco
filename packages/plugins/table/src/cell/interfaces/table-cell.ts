import { GridCell, Element } from '@everynote/models'
import { TABLE_CELL_KEY } from '../constants'

export interface TableCell extends GridCell {
  type: typeof TABLE_CELL_KEY
}

export const TableCell = {
  /**
   * 创建一个 cell 元素
   * @param cell
   * @returns
   */
  create: (cell: Partial<Omit<TableCell, 'type'>> = {}): TableCell => {
    // 调用 GridCell 的create函数来创建 table cell
    return GridCell.create<TableCell>({ ...cell, type: TABLE_CELL_KEY })
  },

  isTableCell: (value: any): value is TableCell => {
    return Element.isElement(value) && value.type === TABLE_CELL_KEY
  },
}
