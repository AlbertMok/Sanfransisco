import { Editor, Transforms } from '@everynote/models'
import { blockSelectionStore, isBlockSelecting } from './store'
import { useStore } from 'zustand'
import { useEffect } from 'react'
import { useReadOnly } from '../../hooks'
import Hotkeys from '../../utils/hotkeys'
import { getMatchedNode } from '../../utils/nodes'
import { focusEditor } from '../../utils/focus'

export const useBlockSelectionHooks = (editor: Editor) => {
  const store = blockSelectionStore.getBlockSelectionStore(editor)
  const isSelecting = isBlockSelecting(editor)
  const selectedIds = useStore(store).selectedBlockIds

  // TODO: test

  useEffect(() => {
    const el = document.querySelector('#slate-shadow-input')
    if (el) {
      el.remove()
    }

    // const [isReadonly] = useReadOnly()

    if (isSelecting) {
      const input = document.createElement('input')
      input.setAttribute('id', 'slate-shadow-input')
      // no scrolling on focus
      input.style.position = 'fixed'
      input.style.zIndex = '10000'
      // hide
      input.style.top = '-300px'
      input.style.left = '-300px'
      input.style.opacity = '0'
      input.addEventListener('keydown', (e) => {
        // selecting commands
        if (!selectedIds) return

        if (Hotkeys.isEscape(e)) {
          blockSelectionStore.unSelect(editor)
        }

        // if (isHotkey('mod+z')(e)) {
        //   editor.undo()
        //   selectInsertedBlocks(editor)
        // }
        // if (isHotkey('mod+shift+z')(e)) {
        //   editor.redo()
        //   selectInsertedBlocks(editor)
        // }

        if (Hotkeys.isEnter(e)) {
          // get the first block in the selection
          const entry = getMatchedNode(editor, {
            // 会把最后一个块元素的id传进去
            match: (n) => Editor.isBlock(editor, n) && !!n.id && selectedIds.has(n.id),
          })
          if (entry) {
            const [, path] = entry

            // focus the end of that block
            focusEditor(editor, Editor.end(editor, path))
            console.log(123)
          }
          e.preventDefault()
        }

        if (Hotkeys.isDeleteBackward(e) || Hotkeys.isDeleteForward(e)) {
          Transforms.removeNodes(editor, {
            at: [],
            match: (n) => Editor.isBlock(editor, n) && !!n.id && selectedIds.has(n.id),
          })
          focusEditor(editor)
        }
      })

      // // TODO: paste + select blocks if selecting editor
      // input.addEventListener('copy', (e) => {
      //   e.preventDefault()

      //   if (blockSelectionSelectors.isSelectingSome()) {
      //     copySelectedBlocks(editor)
      //   }
      // })
      // input.addEventListener('cut', (e) => {
      //   e.preventDefault()

      //   if (blockSelectionSelectors.isSelectingSome()) {
      //     copySelectedBlocks(editor)

      //     if (!isReadonly) {
      //       removeNodes(editor, {
      //         at: [],
      //         match: (n) => blockSelectionSelectors.selectedIds().has(n.id),
      //       })
      //     }
      //   }
      // })
      // input.addEventListener('paste', (e) => {
      //   e.preventDefault()

      //   if (!isReadonly) {
      //     pasteSelectedBlocks(editor, e)
      //   }
      // })
      document.body.append(input)
      input.focus()
    }
  }, [editor, isSelecting, selectedIds])
  return
}
