import {
  Editable,
  useEditableStatic,
  useDragMethods,
  FormatData,
  useDragging,
  SlotComponentProps,
  useLocale,
  useIsomorphicLayoutEffect,
  useReadOnly,
  DATA_EDITABLE_PLACEHOLDER,
  DATA_EDITABLE_STRING,
  DATA_EDITABLE_ZERO_WIDTH,
  DATA_EDITABLE_NODE,
} from '@editablejs/editor'
import { DOMElement, Editor, GridCell, Transforms } from '@editablejs/models'
import * as React from 'react'
import { Point, Icon, Tooltip } from '@editablejs/ui'
import {
  useSideToolbarMenuOpen,
  SideToolbar as SideToolbarStore,
  useSideToolbarDecorateOpen,
} from '../store'
import { SideToolbarLocale } from '../locale'
import tw from 'twin.macro'
import { ContextMenu } from './context-menu'
import {
  clearCapturedData,
  getCapturedData,
  setCapturedData,
} from '../weak-map'
import { getOptions } from '../options'

export interface SideToolbar extends SlotComponentProps {}

const StyledTooltipContent = tw.div`text-gray-400 text-xs text-left`

const StyledTooltipContentAction = tw.span`text-white mr-1`

// 递归找出第一个元素
const findFirstElementChild = (el: DOMElement): DOMElement => {
  const child = el.firstElementChild
  if (!child) return el // 如果没有子元素的话
  if (child.querySelector(`[${DATA_EDITABLE_PLACEHOLDER}]`)) {
    const next = child.nextElementSibling
    if (next) return findFirstElementChild(next)
    return el
  }
  return findFirstElementChild(child)
}

export const SideToolbar: React.FC<SideToolbar> = () => {
  const editor = useEditableStatic()
  const {
    delayDragDuration = 0.2, //初始化拖拽操作的延迟持续时间
    delayHideDuration = 0.2, //初始化隐藏操作的延迟持续时间
    horizontalDistanceThreshold = 30, //水平距离阈值，默认值为 30 ,意思是在其左边距离多少的时候就出现按钮
    verticalDistanceThreshold = 30, //垂直距离阈值，默认值为 30
    match,
  } = React.useMemo(() => {
    return getOptions(editor) //getOptions(editor) 函数来获取当前编辑器实例的选项配置
  }, [editor]) //当editor变化时，useMemo 钩子内的函数会被重新执行。
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 位置 x y 坐标
  const [position, setPosition] = React.useState<Point | null>(null)

  const [menuOpen, setMenuOpen] = useSideToolbarMenuOpen(editor)
  // const prevVisibleRef = React.useRef(false)
  const prevEventPositionRef = React.useRef<Point | null>(null)

  const showingRef = React.useRef(false)

  const delayHideTimer = React.useRef<number | null>(null)

  const [readOnly] = useReadOnly() //是否为只读模式，即内容不可编辑

  const dragging = useDragging()
  const hide = React.useCallback(() => {
    if (dragging) return //正在拖动，就不隐藏
    // 设置隐藏参数
    setPosition(null)
    setMenuOpen(false)
    SideToolbarStore.setDecorateOpen(editor, false)
    setTooltipDefaultOpen(false)
    clearCapturedData(editor)
    showingRef.current = false
  }, [editor, dragging, setMenuOpen])

  React.useEffect(() => {
    if (!menuOpen) {
      SideToolbarStore.setDecorateOpen(editor, false)
    }
  }, [editor, menuOpen])

  React.useEffect(() => {
    const handleSelectionChange = () => {
      if (menuOpen) {
        hide()
      }
    }
    const handleFocus = () => {
      setMenuOpen(false)
      setTooltipDefaultOpen(false)
    }
    editor.on('focus', handleFocus)
    editor.on('selectionchange', handleSelectionChange)
    return () => {
      editor.off('focus', handleFocus)
      editor.off('selectionchange', handleSelectionChange)
    }
  }, [editor, hide, menuOpen, setMenuOpen])

  React.useEffect(() => {
    const handleKeyup = () => {
      hide()
    }
    editor.on('keyup', handleKeyup)
    return () => {
      editor.off('keyup', handleKeyup)
    }
  }, [editor, hide])

  const clearDelayHideTimer = React.useCallback(() => {
    if (delayHideTimer.current) {
      clearTimeout(delayHideTimer.current)
      delayHideTimer.current = null
    }
  }, [])

  const delayHide = React.useCallback(
    (delayS: number = delayHideDuration) => {
      const delay = delayS * 1000
      clearDelayHideTimer()
      if (delay) {
        delayHideTimer.current = window.setTimeout(() => {
          hide()
          clearDelayHideTimer()
        }, delay)
      } else {
        hide()
      }
    },
    [clearDelayHideTimer, hide, delayHideDuration]
  )

  // 更新鼠标位置
  const handleUpdatePosition = React.useCallback(
    (event: MouseEvent) => {
      const point = Editable.findEventPoint(editor, event)
      if (!point) return
      let isFindList = false
      // Get the matching ancestor above a location in the document.
      const entry = Editor.above(editor, {
        at: point,
        match: (n) => {
          const customMatch = match?.(n)
          if (customMatch === false) return false
          // 如果是列表（有序、无序）
          if (!isFindList && Editor.isList(editor, n)) {
            isFindList = true
            return true
          }
          return isFindList ? false : Editor.isBlock(editor, n) // 判断是列表元素还是block元素
        },
        mode: 'all',
      })

      if (!entry) return delayHide()

      const [node, path] = entry
      const isVoid = editor.isVoid(node) //是否为void元素

      const element = Editable.toDOMNode(editor, node)
      // 优先对齐文本节点
      const textElement = isFindList // 如果是列表的话
        ? findFirstElementChild(element) // 递归寻找文本节点
        : element.querySelector(
            `[${DATA_EDITABLE_STRING}],[${DATA_EDITABLE_ZERO_WIDTH}]`
          ) // 寻找与指定选择器或选择器组匹配的第一个Element元素

      // const rects = (!isVoid && textElement ? textElement : element).getClientRects()
      const rects = element.getClientRects()

      if (!rects.length) return delayHide()
      const rect = Array.from(rects).find((rect) => rect.height > 0) ?? rects[0]
      let { x, y, height } = rect

      const gridCell = GridCell.find(editor, point)
      if (gridCell) {
        const cellElement = Editable.toDOMNode(editor, gridCell[0])
        const cellRect = cellElement.getBoundingClientRect()
        x = cellRect.x
      }

      const [left, top] = Editable.toRelativePosition(
        editor,
        x,
        isVoid ? y : y + height / 2
      )
      console.log(isVoid)
      clearDelayHideTimer()

      setCapturedData(editor, {
        selection: Editor.range(editor, path),
        element: node,
        path,
        isEmpty: Editor.isEmpty(editor, node),
        isVoid,
      })

      setPosition({
        x: left,
        y: top,
      })
    },
    [clearDelayHideTimer, delayHide, editor]
  )

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (dragging || menuOpen) return

      const { clientX, clientY } = event

      const data = getCapturedData(editor)
      // 介于按钮和节点区域之间不处理
      if (containerRef.current && data) {
        const { x, y, bottom } = Editable.toDOMNode(
          editor,
          data.element
        ).getBoundingClientRect()
        const currentRect = containerRef.current.getBoundingClientRect()
        const { x: cX } = currentRect
        if (
          clientX >= cX &&
          clientX <= x &&
          clientY >= y &&
          clientY <= bottom
        ) {
          return
        }
      }
      // 编辑器的容错范围外直接隐藏
      const container = Editable.toDOMNode(editor, editor)
      const { x, y, width, height } = container.getBoundingClientRect()
      if (
        clientX < x - horizontalDistanceThreshold ||
        clientX > x + width + horizontalDistanceThreshold ||
        clientY < y - verticalDistanceThreshold ||
        clientY > y + height + verticalDistanceThreshold
      ) {
        return delayHide()
      }

      const { x: pX, y: pY } = prevEventPositionRef.current ?? { x: 0, y: 0 }

      if (Math.abs(pX - clientX) <= 3 && Math.abs(pY - clientY) <= 3) return

      prevEventPositionRef.current = {
        x: clientX,
        y: clientY,
      }

      handleUpdatePosition(event)
    },
    [
      dragging,
      menuOpen,
      handleUpdatePosition,
      delayHide,
      horizontalDistanceThreshold,
      verticalDistanceThreshold,
    ]
  )

  const handleMoseLeave = React.useCallback(() => {
    clearDelayHideTimer()
    if (!showingRef.current) delayHide()
  }, [clearDelayHideTimer, delayHide])

  // 监听事件
  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [editor, handleMoseLeave, handleMouseMove])

  const decorateOpen = useSideToolbarDecorateOpen(editor)
  useIsomorphicLayoutEffect(() => {
    const data = getCapturedData(editor)

    if (decorateOpen && data) {
      const domElement = Editable.toDOMNode(editor, data.element)
      const prevCssText = domElement.style.cssText
      // 选中的元素的背景
      domElement.style.cssText = `
    border-radius: 3px;
    background-color: rgb(235 238 253 / 1);
    ${prevCssText}
    `
      return () => {
        domElement.style.cssText = prevCssText
      }
    }
  }, [editor, decorateOpen])

  const visible = React.useMemo(() => {
    // !!是 JavaScript 中的一种常见的类型转换技巧，它的作用是将一个值强制转换为布尔值（Boolean
    // 如果 position 有值，!!position 将为 true，如果 position 是 null、undefined 或空字符串，!!position 将为 false
    return !!position
  }, [position]) //函数中的计算结果会被缓存，只有在依赖数组中的值发生变化时才会重新计算。

  // 判断元素是否内容为空,为空则为add,不为空就是drag
  const actionType = getCapturedData(editor)?.isEmpty ? 'add' : 'drag'
  const transformPosition = React.useMemo(() => {
    if (!position || !containerRef.current) return
    const { x, y } = position
    const { offsetWidth, clientHeight } = containerRef.current
    const data = getCapturedData(editor)
    return {
      x: x - offsetWidth - 8,
      y: data?.isVoid ? y : y - clientHeight / 2,
    }
  }, [position, editor])

  // const isTransformAmimation = React.useMemo(() => {
  //   const visible = !!position
  //   const isAmimation = visible === prevVisibleRef.current
  //   prevVisibleRef.current = visible
  //   return isAmimation
  // }, [position])

  const { setDrag } = useDragMethods()

  const drag = React.useCallback(() => {
    const data = getCapturedData(editor)
    if (!data || !position) {
      return
    }
    const { path, element } = data
    const dataTransfer = new DataTransfer()
    FormatData.setDataTransfer(dataTransfer, {
      fragment: [element],
    })
    setDrag({
      type: 'block',
      from: path,
      data: dataTransfer,
      position,
    })
  }, [position, setDrag, editor])

  const [tooltipDefaultOpen, setTooltipDefaultOpen] = React.useState(false)
  const delayDragTimer = React.useRef<number | null>(null)

  const clearDelayDragTimer = React.useCallback(() => {
    if (delayDragTimer.current) {
      clearTimeout(delayDragTimer.current)
      delayDragTimer.current = null
    }
  }, [])

  const delayDrag = React.useCallback(
    (delayS: number = delayDragDuration) => {
      const delay = delayS * 1000
      clearDelayDragTimer()
      if (delay) {
        delayDragTimer.current = window.setTimeout(() => {
          drag()
          clearDelayDragTimer()
        }, delay)
      } else {
        drag()
      }
    },
    [clearDelayDragTimer, drag, delayDragDuration]
  )

  const handleMouseDown = () => {
    if (actionType === 'drag') delayDrag()
  }

  const handleMouseUp = () => {
    clearDelayDragTimer()
    setDrag(null)
    setMenuOpen(!menuOpen)
    setTooltipDefaultOpen(true)
  }

  const handleMouseEnter = () => {
    clearDelayHideTimer()
    showingRef.current = true
    const data = getCapturedData(editor)
    SideToolbarStore.setDecorateOpen(editor, !!data)
  }

  const handleMouseLeave = () => {
    if (menuOpen) return
    delayHide()
    showingRef.current = false
    SideToolbarStore.setDecorateOpen(editor, false)
  }

  const local = useLocale<SideToolbarLocale>('sideToolbar')

  const renderTooltipContent = () => {
    const contents = [
      <div key="action-open-menu">
        <StyledTooltipContentAction>
          {local.actionClick}
        </StyledTooltipContentAction>
        {local.openMenu}
      </div>,
    ]
    if (actionType === 'drag')
      contents.push(
        <div key="action-drag">
          <StyledTooltipContentAction>
            {local.actionDrag}
          </StyledTooltipContentAction>
          {local.dragDrop}
        </div>
      )
    return <StyledTooltipContent>{contents}</StyledTooltipContent>
  }

  const handleMenuSelect = () => {
    const data = getCapturedData(editor)
    if (data) {
      const { selection } = data
      Transforms.select(editor, selection)
    }
    hide()
  }

  const renderMenu = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    return (
      <div
        tw="absolute top-0"
        style={{
          right: `${(containerRef.current.offsetWidth ?? 0) + 2}px`,
        }}
      >
        <ContextMenu
          editor={editor}
          open={true}
          onSelect={handleMenuSelect}
          side="left"
          container={{
            x: rect.left - 5,
            y: rect.top,
          }}
          minWidth={200}
        />
      </div>
    )
  }

  const renderBtn = () => {
    return (
      <div
        ref={containerRef}
        tw="absolute left-0 top-0 z-10 flex "
        style={{
          opacity: visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          left: transformPosition?.x,
          top: transformPosition?.y,
          height: '24px',
          // transition: isTransformAmimation ? 'all 0.2s linear 0s' : 'opacity 0.2s linear 0s',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          tw="flex items-center justify-center rounded-md bg-white border border-solid border-gray-300 shadow-sm text-xs text-gray-600  cursor-grab hover:bg-gray-200"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onDragStart={(e) => e.preventDefault()}
        >
          <Icon name={actionType === 'drag' ? 'drag' : 'plus'} />
        </div>

        {menuOpen && renderMenu()}
      </div>
    )
  }

  if (readOnly) return null

  if (dragging || menuOpen || !visible) return renderBtn()

  return (
    <Tooltip
      content={renderTooltipContent()}
      defaultOpen={tooltipDefaultOpen}
      side="top"
    >
      {renderBtn()}
    </Tooltip>
  )
}