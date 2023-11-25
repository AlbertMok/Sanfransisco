import { generateId } from '@editablejs/editor'
import { Element, Editor, NodeEntry, Path, Transforms, Node, Range, Location, BaseEditor } from '@editablejs/models'
import { UNORDERED_LIST_KEY } from '../unordered/constants'
import { ORDERED_LIST_KEY } from '../ordered/constants'
import { TASK_LIST_KEY } from '../task/constants'

/**
 * List is an element interface which extends Element
 */
export interface List extends Element {
  currentNumber: number
  key: string // 是列表项的唯一标识符
  level: number // 表示列表的级别或深度
  type: string
  template?: string
}

export interface ListAboveOptions {
  at?: Location
  match?: (node: List) => boolean
}

export interface GetLevelOptions {
  type: string
  key: string
  node: Element
  path: Path
}

export interface WrapListOptions extends ListAboveOptions {
  props?: (key: string, node: Element, path: Path) => Record<string, any>
}

export interface UnwrapListOptions extends ListAboveOptions {
  props?: (node: List, path: Path) => Record<string, any>
}

export interface SplitListOptions extends ListAboveOptions {
  props?: (node: List, path: Path) => Record<string, any>
}

export interface DeleteLevelOptions extends ListAboveOptions {
  unwrapProps?: (node: Node, path: Path) => Record<string, any>
}

interface FindFirstListOptions {
  path: Path
  key: string
  level?: number
  type?: string
}

type UpdateStartOptions = FindFirstListOptions & {
  mode?: 'all' | 'after'
  start?: number // 有序列表的当前编号 old
  currentNumber?: number
}

export interface ListTemplate {
  key: string
  depth: number
  render: (element: Omit<List, 'children'>) => string | Record<'type' | 'text', string>
}

const TEMPLATE_WEAKMAP = new WeakMap<Editor, Map<string, ListTemplate[]>>()

export const List = {
  isList: (editor: Editor, node: any): node is List => {
    return Element.isElement(node) && (node.type === UNORDERED_LIST_KEY || node.type === ORDERED_LIST_KEY || node.type === TASK_LIST_KEY)
  },

  /**
   * 查找当前光标或所选位置上方的列表元素
   * @param editor
   * @param options
   * @returns
   */
  above: (editor: Editor, options: ListAboveOptions = {}) => {
    const { at, match } = options
    const selection = at ?? editor.selection
    if (!selection) return
    const entry = Editor.above<List>(editor, {
      at: selection,
      match: (node) => List.isList(editor, node) && (!match || match(node)), // 检查节点是否满足外部传入的 match 函数的条件
    })
    return entry
  },

  /**
   * 返回与给定条件匹配的所有列表
   * @param editor
   * @param options
   * @returns
   */
  lists: (editor: Editor, options: ListAboveOptions = {}) => {
    const { at, match } = options
    const elements = Editor.elements(editor, at)
    const entries: NodeEntry<List>[] = []
    for (const key in elements) {
      entries.push(...(elements[key].filter(([node]) => List.isList(editor, node) && (!match || match(node))) as any))
    }
    return entries
  },

  /**
   * 查找符合条件的最顶部列表
   * @param editor
   * @param options
   * @returns
   */
  findFirstList: (
    editor: Editor,
    options: FindFirstListOptions & {
      match?: (node: List, path: Path) => boolean
    }
  ) => {
    const { key, level, type, match: optionMatch } = options
    let { path } = options
    let entry: NodeEntry<List> | undefined = undefined
    const match = (n: Node): n is List => List.isList(editor, n) && (!type || n.type === type) && n.key === key
    while (true) {
      const prev = Editor.previous<List>(editor, { at: path, match })
      if (!prev) break
      const [prevList, p] = prev
      if (level !== undefined && prevList.level < level) {
        break
      }
      path = p
      entry = prev
      if (optionMatch && optionMatch(entry[0], entry[1])) break
    }
    if (!entry) {
      // 获取第一个nodeEntry
      ;[entry] = Editor.nodes<List>(editor, {
        at: path,
        match: (n) => match(n) && (level === undefined || n.level === level),
      })
    }
    return entry
  },

  /**
   * 检查给定的列表是否是最顶部的列表
   * @param editor
   * @param options
   * @returns
   */
  isFirstList: (editor: Editor, options: FindFirstListOptions) => {
    const { path } = options
    const root = List.findFirstList(editor, options)
    if (!root) return true
    return Path.equals(path, root[1])
  },

  /**
   * 更新最开始的
   * @param editor
   * @param options
   */
  updateStart: (editor: Editor, options: UpdateStartOptions) => {
    const { path, key, type, level, mode = 'all', start } = options

    // startPath是第一个列表元素的path
    let startPath = path
    // startMap为一个空的记录对象，用于记录每个级别的开始序号。用于记录当前的level对应的开始的编号
    const startMap: Record<number, number> = {}
    // start是定义了的
    if (start !== undefined) {
      // 设置对应的level和start编号
      startMap[level ?? 0] = start
    }

    // mode 默认为 'all'
    if (mode === 'all') {
      const top = List.findFirstList(editor, { path, key, level, type })
      // 寻找第一个列表元素
      if (top) {
        // 获取第一个列表元素的 node 和 path
        const [listNode, path] = top
        startPath = path
        if (start === undefined) startMap[listNode.level] = listNode.currentNumber
      }
    } else {
      const startList = Node.get(editor, path)
      if (Editor.isList(editor, startList) && (!type || startList.type === type) && start === undefined) {
        startMap[startList.level] = startList.currentNumber
      }
    }

    // 获取第一个列表元素的level
    const levelOut = Number(Object.keys(startMap)[0])
    let prevLevel = levelOut // prevLevel是 相对于当前列表元素的前一个列表元素的level

    while (true) {
      // 从第二个列表元素开始算起来
      const next = Editor.next<List>(editor, {
        at: startPath,
        match: (n) => Editor.isList(editor, n) && (!type || n.type === type) && n.key === key && (level === undefined || n.level === level),
      })
      if (!next) break

      // 下一个元素
      const [listNode, path] = next
      // 更新当前的path
      startPath = path
      const nextLevel = listNode.level
      // 更新当前列表元素的编号
      let currentNumber = startMap[nextLevel]

      if (!currentNumber || nextLevel > prevLevel) {
        currentNumber = startMap[nextLevel] = 1
      } else {
        currentNumber++
        startMap[nextLevel]++
      }

      prevLevel = nextLevel
      Transforms.setNodes<List>(editor, { currentNumber }, { at: startPath })
    }
  },

  /**将选定的元素包装为一个新的列表。这对于用户选择一些文本并将其转换为列表很有用 */
  wrapList<T extends List>(editor: Editor, list: Partial<Omit<T, 'children'>> & { type: string }, opitons: WrapListOptions = {}) {
    const { at } = opitons

    // 默认开始是1
    let { currentNumber = 1, template, type } = list

    List.unwrapList(editor, { at })

    editor.normalizeSelection((selection) => {
      if (editor.selection !== selection) editor.selection = selection

      if (!selection) return

      const entrys = Editor.nodes<Element>(editor, { at: selection, match: (node) => Editor.isBlock(editor, node), mode: 'lowest' })

      const beforePath = Editor.before(editor, selection.anchor.path)

      const afterPath = Editor.after(editor, selection.focus.path)

      // 获取 前一个 列表节点
      const [prev] = Editor.nodes<List>(editor, { at: beforePath, match: (node) => Editor.isList(editor, node) && node.type === type })

      let key = ''

      // 获取下一个列表节点 ,type NodeEntry<T extends Node = Node> = [T, Path]
      let next: NodeEntry<List> | undefined = undefined

      if (prev) {
        const prevListElement = prev[0]
        key = prevListElement.key
        currentNumber = prevListElement.currentNumber + 1
      } else if (([next] = Editor.nodes<List>(editor, { at: afterPath, match: (n) => Editor.isList(editor, n) && n.type === type })) && next) {
        const nextListElement = next[0]
        key = nextListElement.key
        currentNumber = Math.max(nextListElement.currentNumber - 1, 1)
      } else {
        key = generateId()
      }

      const { props } = opitons

      // 处理每个选区内的节点
      let prevPath = null
      for (const [node, path] of entrys) {
        if (prevPath) {
          const prevNode = Node.get(editor, prevPath)

          if (!Editor.isList(editor, prevNode)) {
            currentNumber--
          }
        }

        const newLevel = List.getLevel(editor, { type, path, key, node })
        const newProps = props ? props(key, node, path) : {}
        let element: List = { type, key, currentNumber, template, level: newLevel, ...newProps, children: [{ text: '' }], id: key }
        Transforms.wrapNodes(editor, element, { at: path, mode: 'lowest' })
        prevPath = path
        currentNumber++
      }

      if (prevPath) {
        List.updateStart(editor, { type, path: prevPath, key })
      }
    }, at)
  },

  /**
   * 移除列表结构，将其内容转换为普通文本或段落
   * @param editor
   * @param options
   */
  unwrapList: (editor: Editor, options: UnwrapListOptions = {}) => {
    const { at, match, props } = options

    // 查询当前的列表项
    const activeLists = List.lists(editor, { at, match })

    editor.normalizeSelection((selection) => {
      if (editor.selection !== selection) editor.selection = selection

      let hasList = false
      const topLists = new Map<string, NodeEntry<List>>()

      for (const [element, path] of activeLists) {
        hasList = true
        const { key, type } = element
        if (!topLists.has(key)) {
          const startList = List.findFirstList(editor, { path, key, level: element.level, type }) ?? [element, path]
          topLists.set(key, startList)
        }

        const p = props ? props(element, path) : undefined
        if (p) {
          element.children.forEach((child, index) => {
            if (Editor.isBlock(editor, child)) {
              Transforms.setNodes(editor, { ...p }, { at: path.concat(index) })
            }
          })
        }
      }
      if (!hasList) return

      Transforms.unwrapNodes(editor, { at, match: (n) => List.isList(editor, n) && (!match || match(n)), split: true })

      if (!selection) return

      for (const [key, [list, path]] of topLists) {
        List.updateStart(editor, {
          type: list.type,
          path,
          key: key,
          level: list.level,
          start: list.currentNumber,
        })
      }
    }, at)
  },

  splitList: (editor: Editor, options?: SplitListOptions) => {
    // 获取当前的selection
    const { selection } = editor
    if (!selection || Range.isExpanded(selection)) return

    let { at, match, props } = options ?? {}
    // 获取当前位置的列表元素
    const entry = List.above(editor, { at, match })
    if (!entry) return

    const [list, path] = entry
    const type = list.type

    // 空节点拆分
    if (Editor.isEmpty(editor, list)) {
      // 缩进的节点拆分
      if (list.level > 0) {
        const level = list.level - 1

        const [top] = List.findFirstList(editor, {
          path,
          key: list.key,
          level,
          match: (list) => list.level === level,
        })

        Transforms.setNodes<List>(editor, { type: top.type, level, ...(props ? props(list, path) : {}) }, { at: path })

        List.updateStart(editor, { type, path, key: list.key })

        if (top.type !== type) List.updateStart(editor, { type: top.type, path, key: list.key })
      } else {
        // 节点非空的情况下

        // 基本执行这个
        List.unwrapList(editor, { at, match: (n) => n.type === type })
        List.updateStart(editor, { type, path, key: list.key, level: list.level })
      }

      return
    }

    // split the current list
    Transforms.splitNodes(editor, {
      at,
      match: (node) => List.isList(editor, node) && node.type === type,
      always: true,
    })
    // 设置当前位置的块的id为新的id
    Transforms.setNodes(editor, { id: generateId() }, { at, mode: 'all' })
    Transforms.setNodes(editor, { id: generateId() }, { at, mode: 'lowest' })
    List.updateStart(editor, {
      type,
      path: selection.focus.path, // 传入的是当前光标所在位置
      key: list.key,
      level: list.level,
    })
  },

  /**
   * 删除列表的指定级别。例如，用户可能想要删除整个子列表
   * @param editor
   * @param options
   * @returns
   */
  deleteLevel: (editor: Editor, options?: DeleteLevelOptions) => {
    const { selection } = editor
    if (!selection) return
    const { at, match, unwrapProps } = options ?? {}
    const entry = Editor.above<List>(editor, {
      at,
      match: (n) => List.isList(editor, n) && (!match || match(n)),
    })
    if (!entry) return
    let [list, path] = entry
    const { key } = list
    // 在节点开始位置
    if (Editor.isStart(editor, selection.focus, path)) {
      // 大于0 就减少1
      if (list.level > 0) {
        Transforms.setNodes<List>(
          editor,
          {
            level: list.level - 1,
          },
          {
            at: path,
          }
        )
        return
      }
      const top =
        List.findFirstList(editor, {
          path,
          key,
          level: list.level,
          type: list.type,
        }) ?? entry
      // level 为0 就删除
      Transforms.unwrapNodes(editor, { at: path })

      if (unwrapProps) {
        Transforms.setNodes(
          editor,
          { ...unwrapProps(list, path) },
          {
            at: path,
            mode: 'lowest',
            match: (n) => Editor.isBlock(editor, n),
          }
        )
      }

      List.updateStart(editor, {
        type: list.type,
        path,
        key,
        level: list.level,
        start: top[0].currentNumber,
      })
    }
  },

  /**
   * 根据列表缩进的获取 level ,获取列表的缩进级别,这可以帮助识别列表是主列表还是子列表
   * @param editor
   * @param options
   * @returns
   */
  getLevel: (editor: Editor, options: GetLevelOptions) => {
    console.warn(
      '`List.getLevel` method is unimplemented and always returns 0. You can install `plugin-indent` plugin to make it work. Or implement it yourself.'
    )
    return 0
  },

  /**
   * 根据 level 设置列表的缩进
   * @param editor
   * @param list
   */
  setIndent: (editor: Editor, list: List): List => {
    console.warn('`List.setIndent` method is unimplemented. You can install `plugin-indent` plugin to make it work. Or implement it yourself.')
    return list
  },

  addTemplate: (editor: Editor, type: string, template: ListTemplate) => {
    const templates = TEMPLATE_WEAKMAP.get(editor) ?? new Map()
    const list = templates.get(type) ?? []
    list.push(template)
    templates.set(type, list)
    TEMPLATE_WEAKMAP.set(editor, templates)
  },

  getTemplate: (editor: Editor, type: string, key: string) => {
    const templates = TEMPLATE_WEAKMAP.get(editor) ?? new Map()
    const list: ListTemplate[] = templates.get(type) ?? []
    return list.find((t) => t.key === key)
  },

  isElement: (node: any): node is Element => {
    return Element.isElement(node)
  },
}
