import React, { HTMLAttributes, useMemo } from 'react'
import { Editor, Element } from '@editablejs/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { Editable } from '../../editable'
import { blockSelectionStore } from '../store/selectionStore'

export interface BlockSelectableOptions {
  element: Element
  selectedColor?: string
  active?: boolean
}

const isSelectedBlock = (editor: Editor, id: string | undefined) => {
  const store = blockSelectionStore.getBlockSelectionStore(editor)
  if (id && store.getState().selectedBlockIds.has(id)) {
    return true
  }
  return false
}

const useBlockSelectableState = ({ element, selectedColor, active }: BlockSelectableOptions): BlockSelectableOptions => {
  const editor = useEditableStatic()

  const path = useMemo(() => Editable.findPath(editor, element), [editor, element])
  console.log(element)
  if (!path || Editor.isInline(editor, element)) {
    return { active: active ?? false, element, selectedColor }
  }

  // ?? 意思是当左边的 active 不为 null 或者 undefined 时，返回左边的值，否则返回右边的值
  return {
    active: active ?? true,
    element,
    selectedColor,
  }
}

// 要嵌入的元素的属性
const useBlockSelectable = ({ element, selectedColor }: ReturnType<typeof useBlockSelectableState>) => {
  const editor = useEditableStatic()
  const id = element.id
  const isSelected = isSelectedBlock(editor, id)
  return {
    props: {
      className: isSelected ? 'slate-selected slate-selectable' : 'slate-selectable',
      style: isSelected
        ? {
            backgroundColor: selectedColor,
          }
        : undefined,
      key: id,
    },
  }
}

export const BlockSelectable = ({ options, children, ...props }: { options: BlockSelectableOptions } & HTMLAttributes<HTMLDivElement>) => {
  // 先根据传入的options调用useBlockSelectableState获取state
  const state = useBlockSelectableState(options)

  // 然后根据state调用useBlockSelectable获取props
  const { props: rootProps } = useBlockSelectable(state)

  if (!state.active) return <>{children}</>

  return (
    <div {...rootProps} {...props}>
      {children}
    </div>
  )
}
