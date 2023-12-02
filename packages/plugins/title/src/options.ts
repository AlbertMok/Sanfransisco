import { ElementAttributes } from '@everynote/editor'
import { Editor } from '@everynote/models'
import React from 'react'

export interface TitleComponentProps {
  attributes: ElementAttributes
  children: any
}

export interface TitleOptions {
  placeholder?: React.ReactNode
  component?: React.FC<TitleComponentProps>
}
const TITLE_OPTIONS = new WeakMap<Editor, TitleOptions>()

export const getOptions = (editor: Editor): TitleOptions => {
  return TITLE_OPTIONS.get(editor) ?? {}
}

export const setOptions = (editor: Editor, options: TitleOptions) => {
  TITLE_OPTIONS.set(editor, options)
}
