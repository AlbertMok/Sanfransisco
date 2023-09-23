import { EventEmitter, EventHandler, EventType } from '../plugin/event'
import { useEditableStatic } from './use-editable'
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect'

export const useEvent = <T extends EventType>(type: T, handler: EventHandler<T>) => {
  const editor = useEditableStatic()

  // useIsomorphicLayoutEffect 的目的是在服务器端渲染时，不会报错并在客户端渲染时表现像 useLayoutEffect 一样
  // 在服务器端渲染的情况下，标准的 useLayoutEffect 可能会导致不一致的行为，因为它要求 DOM 存在，但在服务器端渲染期间，DOM 是不可用的。useIsomorphicLayoutEffect 解决了这个问题，它会在服务器端和客户端都以同步方式执行副作用。
  useIsomorphicLayoutEffect(() => {
    const event = EventEmitter.get(editor)
    event.on(type, handler)
    return () => {
      event.off(type, handler)
    }
  }, [type, handler, editor])
}
