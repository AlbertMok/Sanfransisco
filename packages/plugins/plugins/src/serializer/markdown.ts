import { MarkdownSerializer } from '@everynote/serializer/markdown'
import { Editor } from '@everynote/models'
import { withMarkMarkdownSerializerTransform, withMarkMarkdownSerializerPlugin } from '@everynote/plugin-mark/serializer/markdown'
import { withBlockquoteMarkdownSerializerTransform } from '@everynote/plugin-blockquote/serializer/markdown'
import { withCodeBlockMarkdownSerializerTransform } from '@everynote/plugin-codeblock/serializer/markdown'
import { withHeadingMarkdownSerializerTransform } from '@everynote/plugin-heading/serializer/markdown'
import { withHrMarkdownSerializerTransform } from '@everynote/plugin-hr/serializer/markdown'
import { withImageMarkdownSerializerTransform } from '@everynote/plugin-image/serializer/markdown'
import { withLinkMarkdownSerializerPlugin, withLinkMarkdownSerializerTransform } from '@everynote/plugin-link/serializer/markdown'
import {
  withOrderedListMarkdownSerializerTransform,
  withTaskListMarkdownSerializerPlugin,
  withTaskListMarkdownSerializerTransform,
  withUnorderedListMarkdownSerializerTransform,
} from '@everynote/plugin-list/serializer/markdown'
import {
  withTableCellMarkdownSerializerTransform,
  withTableMarkdownSerializerPlugin,
  withTableMarkdownSerializerTransform,
  withTableRowMarkdownSerializerTransform,
} from '@everynote/plugin-table/serializer/markdown'

export const withMarkdownSerializerTransform = (editor: Editor) => {
  const { withEditor } = MarkdownSerializer
  withEditor(editor, withTableCellMarkdownSerializerTransform, {})
  withEditor(editor, withTableRowMarkdownSerializerTransform, {})
  withEditor(editor, withTableMarkdownSerializerTransform, {})
  withEditor(editor, withTaskListMarkdownSerializerTransform, {})
  withEditor(editor, withOrderedListMarkdownSerializerTransform, {})
  withEditor(editor, withUnorderedListMarkdownSerializerTransform, {})
  withEditor(editor, withHrMarkdownSerializerTransform, {})
  withEditor(editor, withHeadingMarkdownSerializerTransform, {})
  withEditor(editor, withCodeBlockMarkdownSerializerTransform, {})
  withEditor(editor, withBlockquoteMarkdownSerializerTransform, {})
  withEditor(editor, withImageMarkdownSerializerTransform, {})
  withEditor(editor, withLinkMarkdownSerializerTransform, {})
  withEditor(editor, withMarkMarkdownSerializerTransform, {})
}

export const withMarkdownSerializerPlugin = (editor: Editor) => {
  const { withEditorPlugin } = MarkdownSerializer
  withEditorPlugin(editor, withTableMarkdownSerializerPlugin)
  withEditorPlugin(editor, withTaskListMarkdownSerializerPlugin)
  withEditorPlugin(editor, withLinkMarkdownSerializerPlugin)
  withEditorPlugin(editor, withMarkMarkdownSerializerPlugin)
}
