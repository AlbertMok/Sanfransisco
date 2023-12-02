import { Editable } from '@everynote/editor'
import { GridCell, Node } from '@everynote/models'
import { setOptions, TableCellOptions } from '../options'
import { CellInnerStyles, CellStyles } from '../../components/cell'
import { TableCellEditor } from './table-cell-editor'

/**
 * 定义渲染 table cell的方式
 * @param editor
 * @param options
 * @returns
 */
export const withTableCell = <T extends Editable>(editor: T, options: TableCellOptions = {}) => {
  const newEditor = editor as T & TableCellEditor

  const { renderElement, isGridCell } = editor

  setOptions(editor, options)

  newEditor.isGridCell = (node: Node): node is GridCell => {
    return TableCellEditor.isTableCell(newEditor, node) || isGridCell(node)
  }

  newEditor.renderElement = (props) => {
    const { element, attributes, children } = props

    if (TableCellEditor.isTableCell(newEditor, element)) {
      const { style, ...rest } = attributes
      return (
        <CellStyles rowSpan={element.rowspan ?? 1} colSpan={element.colspan ?? 1} style={{ ...style, display: element.span ? 'none' : '' }} {...rest}>
          <CellInnerStyles>{children}</CellInnerStyles>
        </CellStyles>
      )
    }
    return renderElement(props)
  }

  return newEditor
}
