import { Editor } from '@everynote/models'
import * as React from 'react'
import { getCursorsStore } from '../store'

export const useCursorStore = (editor: Editor) => {
  return React.useMemo(() => {
    return getCursorsStore(editor)
  }, [editor])
}
