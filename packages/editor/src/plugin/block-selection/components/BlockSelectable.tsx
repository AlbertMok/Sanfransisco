import { Element } from '@everynote/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { blockSelectionStore } from '../store/selectionStore'
import { useStore } from 'zustand'
import { useEffect } from 'react'
import { useFocused } from '../../../hooks'

export interface BlockSelectableOptions {
  element: Element
  selectedColor?: string
  active?: boolean
}

// 要嵌入的元素的属性
export const useBlockSelectable = ({ element }: BlockSelectableOptions) => {
  const editor = useEditableStatic()
  const store = blockSelectionStore.getBlockSelectionStore(editor)

  const [isEditorFocused, setEditorFocused] = useFocused()

  useEffect(() => {
    // using isEditorFocused to make editor whenever focus or blur the current selection will be reset
    if (isEditorFocused || !isEditorFocused) {
      blockSelectionStore.unSelect(editor)
    }
  }, [isEditorFocused])

  const isSelected = element.id ? useStore(store).selectedBlockIds.has(element.id) : false

  return {
    className: isSelected && element.type != 'title' ? 'selected slate-selectable' : 'slate-selectable',
  }
}
