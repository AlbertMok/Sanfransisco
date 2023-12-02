/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

type Method = 'addEventListener' | 'removeEventListener'

type AnyFunction = (...arg: any) => any

export type EventBindingArgs = [(EventTarget | undefined) | (EventTarget | undefined)[], string | string[], AnyFunction, Record<string, unknown>?]

/* eslint-disable prefer-rest-params */
const eventListener =
  // 这是一个高阶函数，它接受 method 参数（'addEventListener' 或 'removeEventListener'），并返回一个新函数。


    (method: Method) =>
    // items : DOM 元素（或元素数组）
    // events : 事件名称（或名称数组
    // fn : 回调函数
    // options : 可选的事件监听器选项
    (items: EventTarget | undefined | (EventTarget | undefined)[], events: string | string[], fn: AnyFunction, options = {}): EventBindingArgs => {
      // Normalize array
      if (items instanceof HTMLCollection || items instanceof NodeList) {
        items = Array.from(items)
      } else if (!Array.isArray(items)) {
        items = [items]
      }

      if (!Array.isArray(events)) {
        events = [events]
      }

      // process the element in items
      // 为每个元素和每个事件添加或移除指定的事件监听器
      for (const element of items) {
        if (element) {
          for (const event of events) {
            element[method](event, fn as EventListener, { capture: false, ...options })
          }
        }
      }

      return [items, events, fn, options]
    }

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener('addEventListener')

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener('removeEventListener')

/**
 * Simplifies a touch / mouse-event , and get the current cursor x coordinate and y coordinate and the target
 * @param evt
 */
export const simplifyEvent = (evt: any): { target: HTMLElement; x: number; y: number } => {
  const { clientX, clientY, target } = evt.touches?.[0] ?? evt
  return { x: clientX, y: clientY, target }
}
