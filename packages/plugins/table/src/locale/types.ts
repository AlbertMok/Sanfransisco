import { Locale } from '@everynote/editor'

export interface TableLocale extends Locale {
  table: {
    mergeCells: string
    splitCells: string
    moveRows: string
    moveCols: string
  }
}
