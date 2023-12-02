import { Editor } from '@everynote/models'
import { getOptions } from '../options'

export interface ContextMenuEditor extends Editor {}

export const ContextMenuEditor = {
  getOptions,
}
