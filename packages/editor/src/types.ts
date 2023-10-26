import { BaseEditor, BaseElement } from '@editablejs/models'
// import { ReactEditor, RenderElementProps } from '@editablejs/models'
// import { HistoryEditor } from 'slate-history'
import { PluginType, RenderHTMLAttributes } from './utils/plugins'
import { CSSProperties, ReactNode } from 'react'
import { RenderElementProps } from './plugin/editable'

export type EmptyText = {
  text: string
}

export type TElementConfig = {
  nodeType: 'block' | 'inline' | 'void'
}

export type Modify<T, R> = Omit<T, keyof R> & R

export type TBaseElement<T> = {
  id: string
  type: T
  children: BaseElement['children']
  // @ts-ignore [TODO: make it generic]
  data?: any
} & TElementConfig

export type RenderYooptaElementProps<T extends BaseElement = BaseElement> =
  RenderElementProps & {
    element: T
  } & RenderHTMLAttributes

export type YooptaEditorValue<V> = V[]
export type YooptaBaseToolEvents = {
  [x: string]: (...args: any) => void
}

export type YooptaBaseToolProps<
  P extends PluginType = PluginType,
  Events extends YooptaBaseToolEvents = YooptaBaseToolEvents,
> = {
  style?: CSSProperties
  className?: string
  plugins?: P[]
  fromHook?: boolean
  on?: Events
}

export interface TEditor extends BaseEditor {
  shortcuts: Record<string, PluginType>
  plugins: Record<
    TBaseElement<string>['type'],
    PluginType<any, TBaseElement<string>>
  >
}

export type YooptaNodeElementSettings = {
  options?: {
    handlers?: {
      onCopy?: () => void
      onDelete?: () => void
      onDuplicate?: () => void
    }
  }
  drag?: boolean
  plus?: boolean
}

export type YooptaTools = {
  ActionMenu?: ReactNode
  Toolbar?: ReactNode
  ChatGPT?: ReactNode
  [x: string]: ReactNode
}
