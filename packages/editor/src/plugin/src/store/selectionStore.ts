import { Editor } from '@editablejs/models'

import { ChangedElements } from '../core'
import { DATA_BLOCK_ID } from '../../../utils/constants'
import create, { StoreApi, UseBoundStore, useStore } from 'zustand'

interface blockSelectionStore {
  selectedBlockIds: Set<string> // 被选择到的块
  isSelecting: boolean // 判断当前是否正在选择中
}

// 根据editor获取 store
const editor_selectedBlocks_map = new WeakMap<Editor, UseBoundStore<StoreApi<blockSelectionStore>>>()
const getBlockSelectionStore = (editor: Editor) => {
  let store = editor_selectedBlocks_map.get(editor)
  // if store is not init or exists in the map
  if (!store) {
    // init a new store
    store = create<blockSelectionStore>(() => ({ selectedBlockIds: new Set<string>(), isSelecting: false }))
    editor_selectedBlocks_map.set(editor, store)
  }
  return store
}

// extract the id from the selection elements
const extractIds = (els: Element[]): string[] => els.map((v) => v.getAttribute(DATA_BLOCK_ID)!!)

export const blockSelectionStore = {
  // function getBlockSelectionStore
  getBlockSelectionStore: getBlockSelectionStore,

  /**
   * set the selected Ids
   * @param changedElements
   * @param editor
   */
  setSelectedIds: ({ added, removed }: ChangedElements, editor: Editor) => {
    // get store
    const store = getBlockSelectionStore(editor)
    // get current store of the selection
    const current = useStore(store, (state) => state.selectedBlockIds)

    extractIds(added).forEach((id) => current.add(id))
    extractIds(removed).forEach((id) => current.delete(id))

    // active selecting
    useStore(store, (state) => (state.isSelecting = true))
  },

  /**
   * reset the selected Ids
   * @param editor
   */
  resetSelectedIds: (editor: Editor) => {
    const store = getBlockSelectionStore(editor)
    useStore(store, (state) => {
      state.selectedBlockIds = new Set<string>()
    })
  },

  /**
   * unselect
   * @param editor
   */
  unSelect: (editor: Editor) => {
    const store = getBlockSelectionStore(editor)
    useStore(store, (state) => {
      state.isSelecting = false
      state.selectedBlockIds = new Set<string>()
    })
  },
}
