import { Grid, Editor, Node } from '@editablejs/models'
import { TableOptions } from '../options'
import { TableCellEditor, TableCell } from '../../cell'
import { TableRow, TableRowEditor } from '../../row'
import { TABLE_KEY } from '../constants'
import { Table } from '../interfaces/table'
import { getOptions } from '../options'
import { defaultTableMinRowHeight } from '../../row/options'
import { calculateAverageColumnWidthInContainer } from '../utils'

export interface CreateTableOptions {
  rows?: number
  cols?: number
}

export interface TableEditor extends Editor {
  insertTable: (options?: CreateTableOptions | Table) => void
}

export const TableEditor = {
  isTableEditor: (editor: Editor): editor is TableEditor => {
    return !!(editor as TableEditor).insertTable
  },

  isTable: (editor: Editor, value: Node): value is Table => {
    return Table.isTable(value)
  },

  isActive: (editor: Editor): boolean => {
    const elements = Editor.elements(editor)[TABLE_KEY] ?? []
    return elements.some((e) => TableEditor.isTable(editor, e[0]))
  },

  getOptions,

  /**
   * 创建表格元素
   * @param editor
   * @param options
   * @returns
   */
  create: (editor: Editor, options: CreateTableOptions = {}): Table => {
    // 定义行数和列数
    const { rows = 5, cols = 5 } = options

    const { minRowHeight = defaultTableMinRowHeight, minColWidth = defaultTableMinRowHeight } = getOptions(editor)

    const rowHeight = minRowHeight

    const tableRows: TableRow[] = []

    // 计算每一列的宽度,即每一个  cell 的宽度
    const tableColsWdith = calculateAverageColumnWidthInContainer(editor, {
      cols,
      minWidth: minColWidth,
      getWidth: (width) => width - 1,
    })

    for (let r = 0; r < rows; r++) {
      tableRows.push(
        // 调用 table row 的 create 方法来创建 row
        TableRowEditor.create(
          editor,
          { height: rowHeight },
          tableColsWdith.map(() => TableCellEditor.create(editor))
        )
      )
    }

    // 调用Grid.Create函数创造表格
    return Grid.create<Table, TableRow, TableCell>({ type: TABLE_KEY, colsWidth: tableColsWdith }, ...tableRows)
  },

  insert: (editor: Editor, options?: CreateTableOptions | Table) => {
    if (TableEditor.isTableEditor(editor)) editor.insertTable(options)
  },
}
