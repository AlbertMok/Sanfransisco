import { Editor } from '@editablejs/models'

export interface ParagraphEditor extends Editor {
  createParagraphElement: (type?: typeof PARAGRAPH_KEY) => void
}

export const ParagraphEditor = {
  isParagraphEditor: (editor: Editor): editor is ParagraphEditor => {
    return !!(editor as ParagraphEditor).createParagraphElement
  },
}
