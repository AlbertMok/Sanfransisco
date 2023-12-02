import { Editor } from '@everynote/models'
import { withBlockquoteTextSerializerTransform } from '@everynote/plugin-blockquote/serializer/text'
import { withListTextSerializerTransform } from '@everynote/plugin-list/serializer/text'
import { withTableTextSerializerTransform } from '@everynote/plugin-table/serializer/text'
import { withMentionTextSerializerTransform } from '@everynote/plugin-mention/serializer/text'
import { TextSerializer } from '@everynote/serializer/text'

export const withTextSerializerTransform = (editor: Editor) => {
  const { withEditor } = TextSerializer
  withEditor(editor, withTableTextSerializerTransform, {})
  withEditor(editor, withListTextSerializerTransform, { editor })
  withEditor(editor, withBlockquoteTextSerializerTransform, {})
  withEditor(editor, withMentionTextSerializerTransform, { editor })
}
