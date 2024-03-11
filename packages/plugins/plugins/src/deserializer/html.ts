import { HTMLDeserializer } from '@everynote/deserializer'
import { withMarkHTMLDeserializerTransform } from '@everynote/plugin-mark/deserializer/html'
import { withFontSizeHTMLDeserializerTransform } from '@everynote/plugin-font/size/deserializer/html'
import { withFontColorHTMLDeserializerTransform } from '@everynote/plugin-font/color/deserializer/html'
import { withBackgroundColorHTMLDeserializerTransform } from '@everynote/plugin-font/background-color/deserializer/html'
import { withHeadingHTMLDeserializerTransform } from '@everynote/plugin-heading/deserializer/html'
import { withBlockquoteHTMLDeserializerTransform } from '@everynote/plugin-blockquote/deserializer/html'
import { withIndentHTMLDeserializerTransform } from '@everynote/plugin-indent/deserializer/html'
import {
  withOrderedListHTMLDeserializerTransform,
  withTaskListHTMLDeserializerTransform,
  withUnorderedListHTMLDeserializerTransform,
} from '@everynote/plugin-list/deserializer/html'
import {
  withTableCellHTMLDeserializerTransform,
  withTableHTMLDeserializerTransform,
  withTableRowHTMLDeserializerTransform,
} from '@everynote/plugin-table/deserializer/html'
import { withLinkHTMLDeserializerTransform } from '@everynote/plugin-link/deserializer/html'
import { withImageHTMLDeserializerTransform } from '@everynote/plugin-image/deserializer/html'
import { withHrHTMLDeserializerTransform } from '@everynote/plugin-hr/deserializer/html'
import { withAlignHTMLDeserializerTransform } from '@everynote/plugin-alignment/deserializer/html'
import { withLeadingHTMLDeserializerTransform } from '@everynote/plugin-leading/deserializer/html'
import { withMentionHTMLDeserializerTransform } from '@everynote/plugin-mention/deserializer/html'
import { withCodeBlockHTMLDeserializerTransform } from '@everynote/plugin-codeblock'

import { withTitleHTMLDeserializerTransform } from '@everynote/plugin-title/deserializer/html'

import { Editor } from '@everynote/models'

export const withHTMLDeserializerTransform = (editor: Editor) => {
  const { withEditor } = HTMLDeserializer
  withEditor(editor, withTableHTMLDeserializerTransform, { editor })
  withEditor(editor, withTableRowHTMLDeserializerTransform, { editor })
  withEditor(editor, withTableCellHTMLDeserializerTransform, {})
  withEditor(editor, withBlockquoteHTMLDeserializerTransform, {})
  withEditor(editor, withUnorderedListHTMLDeserializerTransform, { editor })
  withEditor(editor, withTaskListHTMLDeserializerTransform, { editor })
  withEditor(editor, withOrderedListHTMLDeserializerTransform, { editor })
  withEditor(editor, withHeadingHTMLDeserializerTransform, { editor })
  withEditor(editor, withFontSizeHTMLDeserializerTransform, {})
  withEditor(editor, withFontColorHTMLDeserializerTransform, {})
  withEditor(editor, withBackgroundColorHTMLDeserializerTransform, {})
  withEditor(editor, withMarkHTMLDeserializerTransform, {})
  withEditor(editor, withIndentHTMLDeserializerTransform, {})
  withEditor(editor, withLinkHTMLDeserializerTransform, {})
  withEditor(editor, withImageHTMLDeserializerTransform, { editor })
  withEditor(editor, withHrHTMLDeserializerTransform, {})
  withEditor(editor, withAlignHTMLDeserializerTransform, {})
  withEditor(editor, withLeadingHTMLDeserializerTransform, {})
  withEditor(editor, withMentionHTMLDeserializerTransform, {})
  withEditor(editor, withCodeBlockHTMLDeserializerTransform, {})
  withEditor(editor, withTitleHTMLDeserializerTransform, {})
}
