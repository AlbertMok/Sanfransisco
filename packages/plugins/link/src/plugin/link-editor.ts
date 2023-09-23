import { Editor } from '@editablejs/models'
import { LINK_KEY } from '../constants'
import { Link } from '../interfaces/link'
import { getOptions } from '../options'

export interface LinkEditor extends Editor {
  openLink: () => void

  insertLink: (link: Partial<Omit<Link, 'type'>>) => void

  wrapLink: (link: Partial<Omit<Link, 'type' | 'children'>>) => void

  cancelLink: (link: Link) => void
}

export const LinkEditor = {
  isLinkEditor: (editor: Editor): editor is LinkEditor => {
    return !!(editor as LinkEditor).openLink // 用于检查给定的 editor 是否符合 LinkEditor 接口的结构
  },

  isLink: (editor: Editor, n: any): n is Link => {
    return Link.isLink(n) // 检查给定的 n 是否符合 Link 接口的结构
  },

  isActive: (editor: Editor) => {
    const elements = Editor.elements(editor)
    return !!elements[LINK_KEY] // 用于检查编辑器是否处于链接编辑模式
  },

  getOptions,

  open: (editor: Editor) => {
    if (LinkEditor.isLinkEditor(editor)) editor.openLink()
  },

  insert: (editor: Editor, link: Partial<Omit<Link, 'type'>>) => {
    if (LinkEditor.isLinkEditor(editor)) editor.insertLink(link)
  },

  wrap: (editor: Editor, link: Partial<Omit<Link, 'type' | 'children'>>) => {
    if (LinkEditor.isLinkEditor(editor)) editor.wrapLink(link)
  },

  cancel: (editor: Editor, link: Link) => {
    if (LinkEditor.isLinkEditor(editor)) editor.cancelLink(link)
  },
}
