import { useMemo } from 'react'
import { Editor } from '@everynote/models'
import { getSlashToolbarStore } from '../store'

export const useSlashToolbarStore = (editor: Editor) => {
  return useMemo(() => getSlashToolbarStore(editor), [editor])
}
