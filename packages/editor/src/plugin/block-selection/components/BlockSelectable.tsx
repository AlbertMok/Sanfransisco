import { Element } from '@editablejs/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { blockSelectionStore, isBlockSelecting } from '../store/selectionStore'
import { DATA_BLOCK_ID, DATA_BLOCK_TYPE } from '../../../utils/constants'
import { useStore } from 'zustand'
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
  const id = element.id
  const isSelected = id ? useStore(store).selectedBlockIds.has(id) : false

  return {
    props: {
      [DATA_BLOCK_ID]: element.id,
      [DATA_BLOCK_TYPE]: element.type,
      className: isSelected && element.type != 'title' ? 'selected slate-selectable' : 'slate-selectable',
    },
  }
}
