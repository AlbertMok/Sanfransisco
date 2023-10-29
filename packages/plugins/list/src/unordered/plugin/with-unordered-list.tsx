import { Editable, Hotkey } from '@editablejs/editor'
import { List } from '@editablejs/models'
import { renderList } from '../../styles'
import { UNORDERED_LIST_KEY } from '../constants'
import { UnorderedListOptions, UnorderedListHotkey } from '../options'
import { UnorderedListTemplates } from '../template'
import { UnorderedListEditor, ToggleUnorderedListOptions } from './unordered-list-editor'
import { withShortcuts } from './with-shortcuts'

const defaultHotkey: UnorderedListHotkey = 'mod+shift+8'

const defaultShortcuts = ['*', '-', '+']

export const withUnorderedList = <T extends Editable>(editor: T, options: UnorderedListOptions = {}) => {
  const hotkey = options.hotkey || defaultHotkey

  const newEditor = editor as T & UnorderedListEditor

  UnorderedListTemplates.forEach((template) => {
    List.addTemplate(newEditor, UNORDERED_LIST_KEY, template)
  })

  newEditor.createUnorderedList = (options: ToggleUnorderedListOptions = {}) => {
    const activeElements = UnorderedListEditor.queryActive(editor)

    if (activeElements) {
      List.unwrapList(editor, {
        match: (n) => n.type === UNORDERED_LIST_KEY,
      })
    } else {
      const { template } = options

      List.wrapList(editor, {
        type: UNORDERED_LIST_KEY,
        template: template ?? UnorderedListTemplates[0].key,
      })
    }
  }

  // 重载渲染函数
  const { renderElement } = newEditor
  newEditor.renderElement = (props) => {
    const { element, attributes, children } = props

    if (UnorderedListEditor.isUnorderedList(newEditor, element)) {
      return renderList(newEditor, { props: { element, attributes, children } })
    }

    return renderElement(props)
  }

  const { onKeydown, isList } = newEditor
  newEditor.isList = (node: any): node is List => {
    return UnorderedListEditor.isUnorderedList(newEditor, node) || isList(node)
  }

  newEditor.onKeydown = (e: KeyboardEvent) => {
    if (Hotkey.match(hotkey, e)) {
      e.preventDefault()
      newEditor.createUnorderedList()
      return
    }
    onKeydown(e)
  }

  const { shortcuts } = options
  if (shortcuts !== false) {
    withShortcuts(newEditor, defaultShortcuts.concat(Array.isArray(shortcuts) ? shortcuts : []))
  }

  return newEditor
}
