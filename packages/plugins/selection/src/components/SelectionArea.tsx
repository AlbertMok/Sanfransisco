/* eslint-disable no-use-before-define */
import SelectionAreaClass from '../core/index'
import { SelectionEvents, SelectionOptions } from '../types'
import React, { createRef, useEffect, createContext, useContext, useState } from 'react'

// 允许用户传递自定义的 id、className 以及选择区域特有的事件处理器如 onBeforeStart, onBeforeDrag, onStart, onMove, onStop
export interface SelectionAreaProps extends Omit<Partial<SelectionOptions>, 'boundaries'>, React.HTMLAttributes<HTMLDivElement> {
  id?: string
  className?: string
  onBeforeStart?: SelectionEvents['beforestart']
  onBeforeDrag?: SelectionEvents['beforedrag']
  onStart?: SelectionEvents['start']
  onMove?: SelectionEvents['move']
  onStop?: SelectionEvents['stop']
}

// 用于在组件树中提供 SelectionAreaClass 的实例
const SelectionContext = createContext<SelectionAreaClass | undefined>(undefined)

// 通过调用 useContext 钩子返回当前上下文中的 SelectionAreaClass 实例
export const useSelection = () => useContext(SelectionContext)

export const SelectionArea: React.FunctionComponent<SelectionAreaProps> = (props) => {
  // 用于存储 SelectionAreaClass 的实例
  const [selectionState, setSelection] = useState<SelectionAreaClass | undefined>(undefined)

  // 创建一个引用 (root)，绑定到一个 div 元素上。这个 div 元素作为选择区域的边界
  const root = createRef<HTMLDivElement>()

  // 用于在组件挂载时实例化 SelectionAreaClass 并在卸载时销毁实例
  // 还处理了传递给组件的事件监听器的绑定
  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { onBeforeStart, onBeforeDrag, onStart, onMove, onStop, ...opt } = props

    const areaBoundaries = root.current as HTMLElement

    const selection = new SelectionAreaClass({
      boundaries: areaBoundaries,
      ...opt,
    })

    selection.on('beforestart', (evt) => props.onBeforeStart?.(evt))
    selection.on('beforedrag', (evt) => props.onBeforeDrag?.(evt))
    selection.on('start', (evt) => props.onStart?.(evt))
    selection.on('move', (evt) => props.onMove?.(evt))
    selection.on('stop', (evt) => props.onStop?.(evt))

    setSelection(selection)

    return () => {
      selection.destroy()
      setSelection(undefined)
    }
  }, [])

  return (
    <SelectionContext.Provider value={selectionState}>
      <div ref={root} className={props.className} id={props.id}>
        {props.children}
      </div>
    </SelectionContext.Provider>
  )
}
