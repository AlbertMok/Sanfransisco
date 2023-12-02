import { Locale } from '@everynote/editor'
import { ColorPickerLocale } from '@everynote/ui'

export interface InlineToolbarLocale extends Locale {
  inlineToolbar: {
    colorPicker: ColorPickerLocale
  }
}
