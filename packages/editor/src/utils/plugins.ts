import { HTMLAttributes, ReactElement } from 'react'
import { Element, NodeEntry, Range } from '@everynote/models'
import { TEditor, RenderYooptaElementProps, TBaseElement } from '../types'
import { EditorEventHandlers } from './eventHandlers'
import { HOTKEYS_TYPE } from './hotkeys'

export type HandlersOptions = {
  hotkeys: HOTKEYS_TYPE
  defaultNode: Element
}

export type DecoratorFn = (nodeEntry: NodeEntry) => Range[]

export type PluginEventHandlers = {
  [key in keyof EditorEventHandlers]: (editor: TEditor, options: HandlersOptions) => EditorEventHandlers[key] | void
}

export type RenderHTMLAttributes = {
  HTMLAttributes?: HTMLAttributes<HTMLElement>
}

export type PluginBaseOptions = RenderHTMLAttributes & {
  searchString?: string
  displayLabel?: string
}

/**
 * render element function
 */
export type RenderElementFunc<P extends TBaseElement<string> = TBaseElement<string>> = (
  editor: TEditor,
  plugin: PluginType
) => (props: RenderYooptaElementProps<P> & RenderHTMLAttributes) => ReactElement

// 基本的渲染方法
export type Render<P extends TBaseElement<string>> = RenderElementFunc<P>

// 扩展后的渲染方法
export type ExtendedRender<P extends TBaseElement<string>> = {
  editor: RenderElementFunc<P>
  render: (props: RenderYooptaElementProps<P> & RenderHTMLAttributes) => ReactElement
}

export type YooptaRenderer<P extends TBaseElement<string>> = ExtendedRender<P> | Render<P>

type DeserializeHTML = {
  nodeName: string | string[]
  parse?: (el: HTMLElement) => any | null
}

type Serializes<T, S> = {
  serialize?: (node: T, text: string) => string
  deserialize?: S
  // deserialize: (node: T, text: string) => string;
}

type Exports<T> = {
  html: Serializes<T, DeserializeHTML>
  markdown: Serializes<T, { mark: string; parse: (mark: any) => any }>
}

export type PluginType<O extends PluginBaseOptions = PluginBaseOptions, P extends TBaseElement<string> = TBaseElement<string>> = {
  /**
   * The type of the plugin and element.
   */
  type: string
  /**
   * The plugin's renderer which can be .
   */
  renderer: YooptaRenderer<P>
  /**
   * The element placeholder.
   */
  placeholder?: string | null
  /**
   * The element's shortcuts.
   */
  shortcut?: string | string[]
  /**
   * The element's exports which contain rules for deserializers and serializers for plain text([WIP]) html, markdown.
   */
  exports?: Exports<P>
  /**
   * The element's events: onKeyDown, onCopy and etc.
   */
  events?: PluginEventHandlers
  /**
   * The element's options object that can be extended with custom options for your plugin
   * Default options: HTMLAttributes
   */
  options?: O
  /**
   *
   * @param editor
   * @returns
   */
  extendEditor?: (editor: TEditor) => TEditor
  /**
   * Slate decorator for text ranges. Check docs: https://docs.slatejs.org/concepts/09-rendering#decorations
   */
  decorator?: (editor: TEditor) => DecoratorFn
  /** Slate leaves. Check docs: https://docs.slatejs.org/concepts/09-rendering#decorations */
  leaf?: (editor: TEditor) => (props: RenderLeafProps) => any
  /** Useful key for plugins which contain children as plugin. For example NumberedList contain childPlugin ListItem */
  childPlugin?: YooptaPlugin<any, any>
  hasParent?: boolean
  createElement?: (editor: TEditor, elementData?: Partial<P>) => void
  defineElement: () => P
}

export type ParentYooptaPlugin = Omit<PluginType, 'childPlugin' | 'hasParent'>

export class YooptaPlugin<O extends PluginBaseOptions, P extends TBaseElement<string>> {
  #props: Readonly<PluginType<O, P>>

  constructor(inputPlugin: PluginType<O, P>) {
    this.#props = Object.freeze({ ...inputPlugin })
  }

  extend(
    overrides: Partial<Pick<PluginType<O, P>, 'type' | 'renderer' | 'placeholder' | 'shortcut' | 'exports' | 'events' | 'options' | 'extendEditor'>>
  ) {
    const {
      type = this.#props.type,
      renderer = this.#props.renderer,
      placeholder = this.#props.placeholder,
      shortcut = this.#props.shortcut,
      exports = this.#props.exports,
      events = this.#props.events,
      options,
    } = overrides

    const updatedProps = Object.freeze({
      ...this.#props,
      type,
      renderer,
      placeholder,
      shortcut,
      exports,
      events,
      options: { ...this.#props.options, ...options },
    })

    return new YooptaPlugin<O, P>(updatedProps)
  }

  get getPlugin(): PluginType<O, P> {
    return this.#props
  }
}

export function createYooptaPlugin<O extends PluginBaseOptions, P extends TBaseElement<string>>(input: PluginType<O, P>) {
  return new YooptaPlugin<O, P>(input)
}

export function mergePlugins<O extends PluginBaseOptions, P extends TBaseElement<string>>(plugins: YooptaPlugin<O, P>[]): PluginType<O, P>[] {
  const items: PluginType<O, P>[] = plugins
    .map((instance) => {
      const { childPlugin, ...componentProps } = instance.getPlugin
      return childPlugin ? [componentProps, { ...childPlugin.getPlugin, hasParent: true }] : componentProps
    })
    .flat()

  const uniquePlugins = uniqWith(items, (a, b) => a.type === b.type)
  return uniquePlugins
}

export function mergePluginTypesToMap(
  plugins: PluginType<any, TBaseElement<string>>[]
): Record<TBaseElement<string>['type'], PluginType<any, TBaseElement<string>>> {
  const PLUGINS_MAP = {}
  plugins.forEach((plugin) => (PLUGINS_MAP[plugin.type] = plugin))
  return PLUGINS_MAP
}
