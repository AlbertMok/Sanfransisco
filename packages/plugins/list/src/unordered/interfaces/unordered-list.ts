import { UNORDERED_LIST_KEY } from '../constants'
import { generateId } from '@editablejs/editor'
import { List } from '../../list/list'

export interface UnorderedList extends List {
  type: typeof UNORDERED_LIST_KEY
  id: string
}

export const UnorderedList = {
  isUnorderedList: (node: any): node is UnorderedList => {
    return List.isElement(node) && node.type === UNORDERED_LIST_KEY
  },

  create: (unorderedList: Omit<UnorderedList, 'type'>): UnorderedList => {
    return {
      ...unorderedList,
      type: UNORDERED_LIST_KEY,
      id: generateId(),
    }
  },
}
