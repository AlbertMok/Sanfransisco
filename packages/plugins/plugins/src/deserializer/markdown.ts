import { MarkdownDeserializer } from '@everynote/deserializer/markdown'
import { withMarkMarkdownDeserializerTransform, withMarkMarkdownDeserializerPlugin } from '@everynote/plugin-mark/deserializer/markdown'
import {
  withBlockquoteMarkdownDeserializerTransform,
  withBlockquoteMarkdownDeserializerPlugin,
} from '@everynote/plugin-blockquote/deserializer/markdown'
import {
  withCodeBlockMarkdownDeserializerPlugin,
  withCodeBlockMarkdownDeserializerTransform,
} from '@everynote/plugin-codeblock/deserializer/markdown'
import { withHeadingMarkdownDeserializerPlugin, withHeadingMarkdownDeserializerTransform } from '@everynote/plugin-heading/deserializer/markdown'
import { withHrMarkdownDeserializerPlugin, withHrMarkdownDeserializerTransform } from '@everynote/plugin-hr/deserializer/markdown'
import { withImageMarkdownDeserializerPlugin, withImageMarkdownDeserializerTransform } from '@everynote/plugin-image/deserializer/markdown'
import { withLinkMarkdownDeserializerPlugin, withLinkMarkdownDeserializerTransform } from '@everynote/plugin-link/deserializer/markdown'
import {
  withOrderedListMarkdownDeserializerPlugin,
  withOrderedListMarkdownDeserializerTransform,
  withTaskListMarkdownDeserializerPlugin,
  withTaskListMarkdownDeserializerTransform,
  withUnorderedListMarkdownDeserializerPlugin,
  withUnorderedListMarkdownDeserializerTransform,
} from '@everynote/plugin-list/deserializer/markdown'
import {
  withTableCellMarkdownDeserializerTransform,
  withTableMarkdownDeserializerPlugin,
  withTableMarkdownDeserializerTransform,
  withTableRowMarkdownDeserializerTransform,
} from '@everynote/plugin-table/deserializer/markdown'

import { Editor } from '@everynote/models'

export const withMarkdownDeserializerPlugin = (editor: Editor) => {
  const { withEditorPlugin } = MarkdownDeserializer
  withEditorPlugin(editor, withTableMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withTaskListMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withOrderedListMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withUnorderedListMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withHrMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withHeadingMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withCodeBlockMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withBlockquoteMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withImageMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withLinkMarkdownDeserializerPlugin)
  withEditorPlugin(editor, withMarkMarkdownDeserializerPlugin)
}

export const withMarkdownDeserializerTransform = (editor: Editor) => {
  const { withEditor } = MarkdownDeserializer
  withEditor(editor, withTableCellMarkdownDeserializerTransform, {})
  withEditor(editor, withTableRowMarkdownDeserializerTransform, {})
  withEditor(editor, withTableMarkdownDeserializerTransform, {})
  withEditor(editor, withTaskListMarkdownDeserializerTransform, {})
  withEditor(editor, withOrderedListMarkdownDeserializerTransform, {})
  withEditor(editor, withUnorderedListMarkdownDeserializerTransform, {})
  withEditor(editor, withHrMarkdownDeserializerTransform, {})
  withEditor(editor, withHeadingMarkdownDeserializerTransform, { editor })
  withEditor(editor, withCodeBlockMarkdownDeserializerTransform, {})
  withEditor(editor, withBlockquoteMarkdownDeserializerTransform, {})
  withEditor(editor, withImageMarkdownDeserializerTransform, {})
  withEditor(editor, withLinkMarkdownDeserializerTransform, {})
  withEditor(editor, withMarkMarkdownDeserializerTransform, {})
}
