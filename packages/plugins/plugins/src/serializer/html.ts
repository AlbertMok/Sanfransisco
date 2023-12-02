import { HTMLSerializer } from '@everynote/serializer/html'
import { withMarkHTMLSerializerTransform } from '@everynote/plugin-mark/serializer/html'
import { withFontSizeHTMLSerializerTransform } from '@everynote/plugin-font/size/serializer/html'
import { withFontColorHTMLSerializerTransform } from '@everynote/plugin-font/color/serializer/html'
import { withBackgroundColorHTMLSerializerTransform } from '@everynote/plugin-font/background-color/serializer/html'
import { withHeadingHTMLSerializerTransform } from '@everynote/plugin-heading/serializer/html'
import { withBlockquoteHTMLSerializerTransform } from '@everynote/plugin-blockquote/serializer/html'
import { withIndentHTMLSerializerTransform } from '@everynote/plugin-indent/serializer/html'
import {
  withOrderedListHTMLSerializerTransform,
  withTaskListHTMLSerializerTransform,
  withUnorderedListHTMLSerializerTransform,
} from '@everynote/plugin-list/serializer/html'
import {
  withTableCellHTMLSerializerTransform,
  withTableRowHTMLSerializerTransform,
  withTableHTMLSerializerTransform,
} from '@everynote/plugin-table/serializer/html'
import { withLinkHTMLSerializerTransform } from '@everynote/plugin-link/serializer/html'
import { withImageHTMLSerializerTransform } from '@everynote/plugin-image/serializer/html'
import { withHrHTMLSerializerTransform } from '@everynote/plugin-hr/serializer/html'
import { withAlignHTMLSerializerTransform } from '@everynote/plugin-alignment/serializer/html'
import { withLeadingHTMLSerializerTransform } from '@everynote/plugin-leading/serializer/html'
import { withMentionHTMLSerializerTransform } from '@everynote/plugin-mention/serializer/html'
import { withCodeBlockHTMLSerializerTransform } from '@everynote/plugin-codeblock/serializer/html'
import { withTitleHTMLSerializerTransform } from '@everynote/plugin-title/serializer/html'
import { Editor } from '@everynote/models'

export const withHTMLSerializerTransform = (editor: Editor) => {
  const { withEditor } = HTMLSerializer
  withEditor(editor, withTableHTMLSerializerTransform, {})
  withEditor(editor, withTableRowHTMLSerializerTransform, {})
  withEditor(editor, withTableCellHTMLSerializerTransform, {})
  withEditor(editor, withBlockquoteHTMLSerializerTransform, {})
  withEditor(editor, withUnorderedListHTMLSerializerTransform, { editor })
  withEditor(editor, withTaskListHTMLSerializerTransform, {})
  withEditor(editor, withOrderedListHTMLSerializerTransform, { editor })
  withEditor(editor, withHeadingHTMLSerializerTransform, {})
  withEditor(editor, withFontSizeHTMLSerializerTransform, {})
  withEditor(editor, withFontColorHTMLSerializerTransform, {})
  withEditor(editor, withBackgroundColorHTMLSerializerTransform, {})
  withEditor(editor, withMarkHTMLSerializerTransform, {})
  withEditor(editor, withIndentHTMLSerializerTransform, {})
  withEditor(editor, withLinkHTMLSerializerTransform, {})
  withEditor(editor, withImageHTMLSerializerTransform, {})
  withEditor(editor, withHrHTMLSerializerTransform, {})
  withEditor(editor, withAlignHTMLSerializerTransform, {})
  withEditor(editor, withLeadingHTMLSerializerTransform, {})
  withEditor(editor, withMentionHTMLSerializerTransform, { editor })
  withEditor(editor, withCodeBlockHTMLSerializerTransform, { editor })
  withEditor(editor, withTitleHTMLSerializerTransform, {})
}
