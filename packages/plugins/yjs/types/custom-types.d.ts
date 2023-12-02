import { BaseElement } from '@everynote/editor'

declare module '@everynote/editor' {
  interface CustomTypes {
    Element: BaseElement & {
      type?: string
    }
  }
}
