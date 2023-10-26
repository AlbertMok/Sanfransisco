import { Descendant, Element } from '@editablejs/models'
import { HeadingTags } from '../constants'

export type HeadingType = keyof typeof HeadingTags

export interface Heading extends Element {
  type: HeadingType
  id?: string
}

export type HeadingFontStyleName = 'fontSize' | 'fontWeight'

export type HeadingTextMark = Record<HeadingFontStyleName, string>

export const Heading = {
  isHeading: (element: any): element is Heading => {
    return Element.isElement(element) && !!element.type && element.type in HeadingTags
  },

  create: (type: HeadingType, children: Descendant[] = [{ text: '' }]): Heading => {
    return {
      type,
      children,
    }
  },
}
