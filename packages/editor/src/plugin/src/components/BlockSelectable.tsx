import React, { HTMLAttributes, useMemo } from 'react'

import { Editor, Element } from '@editablejs/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { Editable } from '../../editable'

export interface BlockSelectableOptions {
  element: Element
  selectedColor?: string
  active?: boolean
}

export const useBlockSelectableState = ({ element, selectedColor, active }: BlockSelectableOptions) => {
  const editor = useEditableStatic()

  const path = useMemo(() => Editable.findPath(editor, element), [editor, element])

  if (!path || Editor.isInline(editor, element)) {
    return { active: active ?? false }
  }

  if (!queryNode([element, path], query)) {
    return { active: active ?? false }
  }

  // ?? 意思是当左边的 active 不为 null 或者 undefined 时，返回左边的值，否则返回右边的值
  return {
    active: active ?? true,
    element,
    selectedColor,
  }
}

// 要嵌入的元素的属性
export const useBlockSelectable = ({ element, selectedColor }: ReturnType<typeof useBlockSelectableState>) => {
  const id = element?.id as string | undefined
  const isSelected = useBlockSelectionSelectors().isSelected(id)
  const data = { 'data-key': id }

  return {
    props: {
      className: isSelected ? 'slate-selected slate-selectable' : 'slate-selectable',
      style: isSelected ? { backgroundColor: selectedColor } : undefined,
      key: id,
      ...data,
    },
  }
}
