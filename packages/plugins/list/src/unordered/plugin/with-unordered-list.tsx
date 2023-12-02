import { Editable, Hotkey, generateId } from '@everynote/editor'
import { renderList } from '../../styles'
import { UNORDERED_LIST_KEY } from '../constants'
import { UnorderedListOptions, UnorderedListHotkey } from '../options'
import { UnorderedListTemplates } from '../template'
import { UnorderedListEditor, ToggleUnorderedListOptions } from './unordered-list-editor'
import { withShortcuts } from './with-shortcuts'
import { List } from '../../list/list'

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
    let id = generateId()
    // 如果有多个/1个元素是列表元素
    if (activeElements) {
      List.unwrapList(editor, { match: (n) => n.type === UNORDERED_LIST_KEY })
    } else {
      const { template } = options
      const newListElement = { type: UNORDERED_LIST_KEY, template: template ?? UnorderedListTemplates[0].key, id }
      List.wrapList(editor, newListElement)
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

  const { insertBreak } = newEditor
  newEditor.insertBreak = () => {
    const entry = List.above(editor)
    if (entry) {
      // 当前节点是列表节点
      List.splitList(editor)
      return
    } else {
      insertBreak()
    }
  }

  const { shortcuts } = options
  if (shortcuts !== false) {
    withShortcuts(newEditor, defaultShortcuts.concat(Array.isArray(shortcuts) ? shortcuts : []))
  }

  return newEditor
}
