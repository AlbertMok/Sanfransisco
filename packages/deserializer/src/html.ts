import { Editor, Descendant, Element, Text, DOMNode, isDOMText } from '@editablejs/models'

/**
 * 存储与特定编辑器关联的反序列化转换函数
 */
const HTML_DESERIALIZER_TRANSFORMS: WeakMap<Editor, EditorHTMLDeserializerWithTransform[]> = new WeakMap()

/**
 * 可选的元素
 */
export interface HTMLDeserializerOptions {
  element?: Omit<Element, 'children'>
  text?: Omit<Text, 'text'>
  matchNewline?: true | ((text: string) => boolean)
}

/**
 * 用于将 HTML 节点（或 DOMNode）反序列化为一个可编辑的数据结构
 */
export const HTMLDeserializer = {
  /**
   * 接受一个 DOM 节点和一组选项，并将其反序列化为一个可编辑的数据结构
   * @param node DOM节点
   * @param options HTMLDeserializerOptions选项
   * @returns `Descendant[]` 可编辑的编辑器的数据结构
   */
  transform(node: DOMNode, options: HTMLDeserializerOptions = {}): Descendant[] {
    const { element, text, matchNewline } = options

    /**处理文本节点 */
    if (isDOMText(node)) {
      // 获取文本内容，如果 node.textContent 为 null 或 undefined，则使用空字符串。
      const content = node.textContent ?? ''

      //检查文本内容是否只包含换行符（和可能的空格）。如果 matchNewline 为 true 或者 matchNewline 是一个函数并且返回 true，则直接返回一个空数组（意味着不对此内容进行任何反序列化）
      if (matchNewline && /^\s{0,}(\r\n|\n)+\s{0,}$/.test(content) && (typeof matchNewline === 'boolean' || matchNewline(content))) {
        return []
      }

      // 分割文本内容基于换行符（可以是 \r\n 或 \n），然后将每个文本片段映射为一个带有 text 属性的对象。这个对象还会合并从 options 中传入的任何额外的 text 属性。
      const dataArray = content.split(/\r\n|\n/)
      return dataArray.map((data) => ({ ...text, text: data }))
    }

    /**处理元素节点 */
    // 如果给定的节点不是文本节点，创建一个名为 children 的空数组
    const children = []

    // 遍历 node 的所有子节点，对每个子节点递归调用 transform 函数，然后将结果（一个或多个 Descendant 对象）添加到 children 数组中
    for (const child of node.childNodes) {
      children.push(...this.transform(child, { text }))
    }

    /**节点名称判断 */
    switch (node.nodeName) {
      case 'P':
      case 'DIV':
        // 如果没有任何子孙节点（children.length 为 0），则添加一个只包含空文本的节点到 children 中。
        if (children.length === 0) children.push({ text: '' })
        return [{ ...element, type: 'paragraph', children }]
      default:
        // 对于其他所有类型的节点，默认返回 children
        return children
    }
  },

  /**
   * 允许用户定义一个新的反序列化转换函数并将其与现有的转换函数结合使用
   * @param transform
   * @param options
   */
  with<T = HTMLDeserializerOptions>(transform: HTMLDeserializerWithTransform<T>, options: T) {
    const { transform: t } = this
    this.transform = transform(t.bind(this), this, options)
  },

  /**
   * 允许用户为特定的编辑器定义一个反序列化转换函数
   * @param editor
   * @param transform
   * @param options
   * @returns
   */
  withEditor<T = HTMLDeserializerOptions>(editor: Editor, transform: HTMLDeserializerWithTransform<T>, options: T) {
    const fns = HTML_DESERIALIZER_TRANSFORMS.get(editor) ?? []
    if (fns.find((fn) => fn.transform === transform)) return
    fns.push({
      transform: transform as HTMLDeserializerWithTransform,
      options: options as HTMLDeserializerOptions,
    })
    HTML_DESERIALIZER_TRANSFORMS.set(editor, fns)
  },

  /**
   * 它首先为给定的编辑器创建一个新的反序列化器实例，然后应用与该编辑器关联的所有转换函数，并最后调用其 transform 方法以反序列化给定的节点。
   * @param editor
   * @param node
   * @param options
   * @returns
   */
  transformWithEditor(editor: Editor, node: DOMNode, options: HTMLDeserializerOptions = {}) {
    const HTMLDeserializerEditor = Object.assign({}, HTMLDeserializer)
    const transforms = HTML_DESERIALIZER_TRANSFORMS.get(editor) ?? []

    for (const { transform, options } of transforms) {
      HTMLDeserializerEditor.with(transform, options)
    }

    return HTMLDeserializerEditor.transform(node, options)
  },
}

export type HTMLDeserializerTransform = typeof HTMLDeserializer.transform

export type HTMLDeserializerWithTransform<T = HTMLDeserializerOptions> = (
  next: HTMLDeserializerTransform,
  deserializer: typeof HTMLDeserializer,
  options: T
) => HTMLDeserializerTransform

export interface EditorHTMLDeserializerWithTransform<T = HTMLDeserializerOptions> {
  transform: HTMLDeserializerWithTransform<T>
  options: T
}
