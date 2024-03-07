import React, { useContext } from 'react'
import { SelectionArea, SelectionAreaProps, useSelection } from './SelectionArea'
import { blockSelectionStore } from '../store/selectionStore'
import { Transforms } from '@everynote/models'
import { useEditableStatic } from '../../../hooks/use-editable'
import { SelectionEvent } from '../types'
import { Editable } from '../../editable'

export interface BlockSelectionAreaProps extends Partial<SelectionAreaProps> {}

export const useBlockSelectionArea = (props: BlockSelectionAreaProps): SelectionAreaProps => {
  // 获取编辑器实例
  const editor = useEditableStatic()

  const onStart = ({ event, store, selection }: SelectionEvent) => {
    Editable.blur(editor)
    if (!event?.shiftKey) {
      // 先清空当前的选择
      selection.clearSelection()
      // 重置已经被选择到的 Id
      blockSelectionStore.resetSelectedIds(editor)
    }
  }

  const onMove = ({ store: { changed } }: SelectionEvent) => {
    // 如果当前没有新增的被选择的块或者没有被移除的被选择的块，则退出
    if (changed.added.length === 0 && changed.removed.length === 0) return
    blockSelectionStore.setSelectedIds(changed, editor)
  }

  return {
    className: 'editor',
    style: { position: 'relative', width: '100%' },
    onStart,
    onMove,

    // Class for the selection-area itself (the element).
    selectionAreaClass: 'selection-area',

    // Query selectors for elements which can be selected.
    selectables: props.selectables ?? '.slate-selectable',

    // Query selectors for elements from where a selection can be started from.
    startAreas: props.startAreas ?? 'html',

    // Query selectors for elements from where a selection can not be started from.
    excludeAreas: '.textbox',

    ...props,
  }
}

export function BlockSelectionArea(props: BlockSelectionAreaProps) {
  const componentProps = useBlockSelectionArea(props)

  return <SelectionArea {...componentProps} />
}
