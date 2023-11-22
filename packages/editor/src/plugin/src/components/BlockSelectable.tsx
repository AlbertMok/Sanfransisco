import React, { HTMLAttributes, useMemo } from 'react'
import { findNodePath, getPluginOptions, queryNode } from '@udecode/plate-common'

import { useBlockSelectionSelectors } from '../blockSelectionStore'
import { BlockSelectionPlugin, KEY_BLOCK_SELECTION } from '../createBlockSelectionPlugin'
import { Editor, Element } from '@editablejs/models'
import { useEditableStatic } from '@editablejs/editor'

export interface BlockSelectableOptions {
  element: Element
  selectedColor?: string
  active?: boolean
}

export const useBlockSelectableState = ({ element, selectedColor, active }: BlockSelectableOptions) => {
  const editor = useEditableStatic()

  const path = useMemo(() => findNodePath(editor, element), [editor, element])

  if (!path || Editor.isInline(editor, element)) {
    return { active: active ?? false }
  }

  const { query } = getPluginOptions<BlockSelectionPlugin>(editor, KEY_BLOCK_SELECTION)

  if (query && !queryNode([element, path], query)) {
    return { active: active ?? false }
  }

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

export function BlockSelectable({ options, children, ...props }: { options: BlockSelectableOptions } & HTMLAttributes<HTMLDivElement>) {
  const state = useBlockSelectableState(options)
  const { props: rootProps } = useBlockSelectable(state)

  if (!state.active) return <>{children}</>

  return (
    <div {...rootProps} {...props}>
      {children}
    </div>
  )
}
