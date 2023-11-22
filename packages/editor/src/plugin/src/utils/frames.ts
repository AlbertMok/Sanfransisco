/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFunction = (...args: any[]) => void

// 定义了一个用于在浏览器的动画帧中调用函数的 TypeScript 实用工具
export interface Frames<F extends AnyFunction = AnyFunction> {
  next(...args: Parameters<F>): void

  cancel(): void
}

export const frames = <Function extends AnyFunction>(fn: Function): Frames<Function> => {
  let previousArgs: Parameters<Function>
  let frameId = -1
  let lock = false

  return {
    next(...args: Parameters<Function>): void {
      previousArgs = args

      if (!lock) {
        lock = true
        frameId = requestAnimationFrame(() => {
          fn(...previousArgs)
          lock = false
        })
      }
    },
    cancel() {
      cancelAnimationFrame(frameId)
      lock = false
    },
  }
}

// 这个工具的主要用途是确保函数 fn 在浏览器的动画帧中按需调用，
// 这对于创建平滑的动画和响应式的用户界面很有用。通过使用 requestAnimationFrame，
// 它可以在每个动画帧中最多调用一次 fn，从而避免了不必要的性能开销。同时，提供的 cancel 方法允许在不需要时取消排队的回调，增加了控制的灵活性
