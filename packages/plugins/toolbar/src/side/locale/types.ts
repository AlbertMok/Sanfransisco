import { Locale } from '@everynote/editor'

export interface SideToolbarLocale extends Locale {
  sideToolbar: {
    actionClick: string
    actionDrag: string
    openMenu: string
    dragDrop: string
  }
}
