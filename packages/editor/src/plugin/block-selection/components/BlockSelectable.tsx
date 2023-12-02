import { Element } from '@everynote/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { blockSelectionStore } from '../store/selectionStore'
import { DATA_BLOCK_ID, DATA_BLOCK_TYPE } from '../../../utils/constants'
import { useStore } from 'zustand'
import { useEffect } from 'react'
import { useFocused } from '../../../hooks/use-focused'

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
    [DATA_BLOCK_ID]: element.id,
    [DATA_BLOCK_TYPE]: element.type,
    className: isSelected && element.type != 'title' ? 'selected slate-selectable' : 'slate-selectable',
  }
}
