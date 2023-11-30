import React, { useContext } from 'react'
import { SelectionArea, SelectionAreaProps, useSelection } from './SelectionArea'
import { SelectionEvent } from '../core'
import { blockSelectionStore } from '../store/selectionStore'
import { Transforms } from '@editablejs/models'
import { useEditableStatic } from '../../../hooks/use-editable'

export interface BlockSelectionAreaProps extends Partial<SelectionAreaProps> {}

export const useBlockSelectionArea = (props: BlockSelectionAreaProps): SelectionAreaProps => {
  // 获取编辑器实例
  const editor = useEditableStatic()

  const onStart = ({ event, store, selection }: SelectionEvent) => {
    console.log(store)
    Transforms.deselect(editor)
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

    changed.added.map((el) => {
      el.classList.add('selected')
    })
    changed.removed.map((el) => {
      el.classList.remove('selected')
    })
  }

  const onStop = ({ event, store, selection }: SelectionEvent) => {
    const selectedStore = blockSelectionStore.getBlockSelectionStore(editor)

    selectedStore.setState({ isSelecting: false })
  }

  return {
    className: 'slate-SelectionArea',
    style: { position: 'relative', width: '100%' },
    onStart,
    onMove,
    onStop,
    selectionAreaClass: 'selection-area',
    selectables: '.slate-selectable',
    startAreas: '.edit-container',
    excludeAreas: '.textbox',
    ...props,
  }
}

export function BlockSelectionArea(props: BlockSelectionAreaProps) {
  const componentProps = useBlockSelectionArea(props)

  return <SelectionArea {...componentProps} />
}
