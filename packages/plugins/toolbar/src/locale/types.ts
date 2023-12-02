import { Locale } from '@everynote/editor'
import { ColorPickerLocale } from '@everynote/ui'

export interface ToolbarLocale extends Locale {
  toolbar: {
    colorPicker: ColorPickerLocale
  }
}
