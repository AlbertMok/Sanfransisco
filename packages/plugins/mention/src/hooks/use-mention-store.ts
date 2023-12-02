import { Editor } from '@everynote/models'
import React from 'react'
import { getMentionStore } from '../store'

export const useMentionStore = (editor: Editor) => {
  return React.useMemo(() => getMentionStore(editor), [editor])
}
