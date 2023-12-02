import { Descendant, Element } from '@everynote/models'
import { BLOCKQUOTE_KEY } from '../constants'

export interface Blockquote extends Element {
  type: typeof BLOCKQUOTE_KEY
  id: string
}

export const Blockquote = {
  isBlockquote(node: any): node is Blockquote {
    return Element.isElement(node) && node.type === BLOCKQUOTE_KEY
  },

  create(children: Descendant[], id: string): Blockquote {
    return {
      id,
      type: BLOCKQUOTE_KEY,
      children,
    }
  },
}
