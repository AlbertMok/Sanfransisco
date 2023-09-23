import * as React from 'react'
import { Descendant, Node, Editor, Scrubber } from '@editablejs/models'
import create, { StoreApi, UseBoundStore } from 'zustand'
import { Editable } from '../plugin/editable'
import { EditableStore, EditableStoreContext } from '../hooks/use-editable'
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect'

const EDITABLE_TO_STORE = new WeakMap<
  Editable,
  UseBoundStore<StoreApi<EditableStore>>
>()

export const EditableProvider = (props: {
  editor: Editable
  value?: Descendant[]
  children: React.ReactNode
  onChange?: (value: Descendant[]) => void
}) => {
  const {
    editor,
    children,
    value = [{ type: 'paragraph', children: [{ text: '' }] }],
    onChange,
    ...rest
  } = props

  const store = React.useMemo(() => {
    const store = EDITABLE_TO_STORE.get(editor)
    if (store) {
      return store
    }
    if (!Node.isNodeList(value)) {
      throw new Error(
        `[Editable] value is invalid! Expected a list of elements` +
          `but got: ${Scrubber.stringify(value)}`
      )
    }
    if (!Editor.isEditor(editor)) {
      throw new Error(
        `[Editable] editor is invalid! you passed:` +
          `${Scrubber.stringify(editor)}`
      )
    }
    editor.children = value
    Object.assign(editor, rest)
    const newStore = create<EditableStore>(() => ({
      editor: [editor],
    }))
    EDITABLE_TO_STORE.set(editor, newStore)
    editor.normalizeNode([editor, []])
    return newStore
  }, [editor, value, rest])

  useIsomorphicLayoutEffect(() => {
    const handleChange = () => {
      if (onChange) {
        onChange(editor.children)
      }
      store.setState({
        editor: [editor],
      })
    }
    editor.on('change', handleChange)
    return () => {
      editor.off('change', handleChange)
    }
  }, [editor, onChange])

  return (
    <EditableStoreContext.Provider
      value={{
        store,
        editor,
      }}
    >
      {children}
    </EditableStoreContext.Provider>
  )
}
