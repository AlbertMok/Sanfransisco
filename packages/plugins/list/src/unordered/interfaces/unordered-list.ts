import { List, Element } from '@editablejs/models'
import { UNORDERED_LIST_KEY } from '../constants'
import { generateId } from '@editablejs/editor'

export interface UnorderedList extends List {
  type: typeof UNORDERED_LIST_KEY
  id: string
}

export const UnorderedList = {
  isUnorderedList: (node: any): node is UnorderedList => {
    return Element.isElement(node) && node.type === UNORDERED_LIST_KEY
  },

  create: (unorderedList: Omit<UnorderedList, 'type'>): UnorderedList => {
    return {
      ...unorderedList,
      type: UNORDERED_LIST_KEY,
      id: generateId(),
    }
  },
}
