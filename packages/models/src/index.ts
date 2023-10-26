import { BaseEditor as SlateBaseEditor, BaseElement, Descendant, NodeEntry, BaseRange, BaseSelection, Location } from 'slate'
import { GridCell } from './interfaces/cell'
import { Grid } from './interfaces/grid'
import { List } from './interfaces/list'
import { GridRow } from './interfaces/row'

type BaseEditor = SlateBaseEditor & {
  id: string
  isSolidVoid: (element: BaseElement) => boolean
  isGrid: (value: any) => value is Grid
  isGridRow: (value: any) => value is GridRow
  isGridCell: (value: any) => value is GridCell
  isList: (value: any) => value is List
  getFragment: (range?: BaseRange) => Descendant[]
  normalizeSelection: (fn: (selection: BaseSelection, options?: { grid: NodeEntry<Grid>; row: number; col: number }) => void, at?: Location) => void
}

// 自定义元素类型
export type TElementConfig = {
  nodeType?: 'block' | 'inline' | 'void'
}

// 自定义元素类型 T 是string类型
type TBaseElement = BaseElement & {
  id?: string
  type?: string
  data?: any
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor
    // Element: BaseElement & { type?: string; id?: string | number }
    Element: TBaseElement
  }
}

// Interface
export * from './interfaces/composition-text'
export * from './interfaces/cell'
export * from './interfaces/row'
export * from './interfaces/grid'
export * from './interfaces/list'
export * from './interfaces/editor'
// Transforms
export * from './transforms'

// Utils
export * from './utils/key'
export * from './utils/dom'

export type { SelectionEdge, RangeMode } from 'slate/dist/interfaces/types'
