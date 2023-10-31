import { List } from '../../list/list'
import { TASK_LIST_KEY } from '../constants'

export interface TaskList extends List {
  type: typeof TASK_LIST_KEY
  checked?: boolean
}

export const TaskList = {
  isTaskList: (node: any): node is TaskList => {
    return List.isElement(node) && node.type === TASK_LIST_KEY
  },

  create: (taskList: Omit<TaskList, 'type'>): TaskList => {
    return {
      ...taskList,
      type: TASK_LIST_KEY,
    }
  },
}
