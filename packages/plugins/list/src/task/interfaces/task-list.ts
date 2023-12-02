import { Element } from '@everynote/models'
import { List } from '../../list/list'
import { TASK_LIST_KEY } from '../constants'
import { generateId } from '@everynote/editor'

export interface TaskList extends List {
  type: typeof TASK_LIST_KEY
  checked?: boolean
}

export const TaskList = {
  isTaskList: (node: any): node is TaskList => {
    return Element.isElement(node) && node.type === TASK_LIST_KEY
  },

  create: (taskList: Omit<TaskList, 'type'>): TaskList => {
    return {
      ...taskList,
      type: TASK_LIST_KEY,
      id: generateId(),
    }
  },
}
