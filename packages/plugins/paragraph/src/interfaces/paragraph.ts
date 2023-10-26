import { Descendant, Element } from '@editablejs/models'

export interface Paragraph extends Element {
  type: typeof PARAGRAPH_KEY
  id?: string
}

export const Paragraph = {
  isParagraph: (element: any): element is Paragraph => {
    return Element.isElement(element) && !!element.type && element.type === PARAGRAPH_KEY
  },

  creat(children: Descendant[], id: string): Paragraph {
    return {
      id,
      type: PARAGRAPH_KEY,
      children,
    }
  },
}
