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
  isBlockSelecting,
} from '@everynote/editor'
import { DOMElement, Editor, Grid, GridCell, Transforms } from '@everynote/models'
import * as React from 'react'
import { Point, Icon, Tooltip } from '@everynote/ui'
import { useSideToolbarMenuOpen, SideToolbar as SideToolbarStore, useSideToolbarDecorateOpen } from '../store'
import { SideToolbarLocale } from '../locale'
import tw from 'twin.macro'
import { ContextMenu } from './context-menu'
import { clearCapturedData, getCapturedData, setCapturedData } from '../weak-map'
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

  // 从SideToolbarOptions中获取参数
  const {
    delayDragDuration = 0.2, //初始化拖拽操作的延迟持续时间
    delayHideDuration = 0.2, //初始化隐藏操作的延迟持续时间
    horizontalDistanceThreshold = 30, //水平距离阈值，默认值为 30 ,意思是在其左边距离多少的时候就出现按钮
    verticalDistanceThreshold = 30, //垂直距离阈值，默认值为 30
    match,
  } = React.useMemo(() => {
    return getOptions(editor) //getOptions(editor) 函数来获取当前编辑器实例的选项配置
  }, [editor])

  /**
   * containerRef是侧边栏悬浮按钮的ref
   */
  const containerRef = React.useRef<HTMLDivElement>(null)

  /**
   * data-block-node:text 的位置，即这个矩形相对于编辑器矩形的原点的 x 坐标 和 y坐标
   */
  const [position, setPosition] = React.useState<Point | null>(null)

  const [menuOpen, setMenuOpen] = useSideToolbarMenuOpen(editor)

  const prevVisibleRef = React.useRef(false)

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
      // 寻找鼠标所在的节点的 point ,这个point是slate的point类型
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

      // 将找到的Slate节点转化为实际的DOM元素， 一般是 data-block-node:element
      const element = Editable.toDOMNode(editor, node)

      // 优先对齐文本节点
      const textElement = isFindList
        ? findFirstElementChild(element) // 如果是列表的话递归寻找文本节点
        : element.querySelector(`[${DATA_EDITABLE_NODE}]`) // 寻找与指定选择器或选择器组匹配的第一个Element元素

      // 获取元素的clientRects
      const rects = (!isVoid && textElement ? textElement : element).getClientRects()

      // 如果没有元素
      if (!rects.length) return delayHide()

      // 在集合中找到第一个具有大于0高度的矩形，如果没有找到这样的矩形，它将默认为集合中的第一个矩形，即data-block-node=text的矩形
      const rect = Array.from(rects).find((rect) => rect.height > 0) ?? rects[0]

      // x是data-block-node=text矩形原点的 x 坐标，y是矩形原点的 y 坐标，height是矩形的高度
      let { x, y, height } = rect

      const elementRect = element.getBoundingClientRect()
      let elementX = elementRect.x
      x = x > elementX ? elementX : x

      // 判断是否为表格元素
      const gridCell = GridCell.find(editor, point)
      const tableNodeEntry = Grid.above(editor, point)
      if (tableNodeEntry) {
        const tableElement = Editable.toDOMNode(editor, tableNodeEntry[0])
        const tableRect = tableElement.getBoundingClientRect()
        x = tableRect.x - 15
      }
      if (gridCell) {
        const cellElement = Editable.toDOMNode(editor, gridCell[0])
        const cellRect = cellElement.getBoundingClientRect()
        x = cellRect.x
      }

      // 获取这个 date-block-node:text 相对于编辑器 data-block-node:editor 的 x 坐标和 y 坐标
      const [left, top] = Editable.toRelativePosition(editor, x, isVoid ? y : y + height / 2)

      clearDelayHideTimer()

      setCapturedData(editor, {
        selection: Editor.range(editor, path),
        element: node,
        path,
        isEmpty: Editor.isEmpty(editor, node),
        isVoid,
      })

      // 设置位置坐标
      setPosition({ x: left, y: top })
    },
    [clearDelayHideTimer, delayHide, editor]
  )

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (dragging || menuOpen) return

      // 获取鼠标的 x 坐标 和 y 坐标
      const { clientX, clientY } = event

      const data = getCapturedData(editor)

      // 介于按钮和节点区域之间不处理
      if (containerRef.current && data) {
        // 获取元素的 data-block-node="element"的矩形
        const { x, y, bottom } = Editable.toDOMNode(editor, data.element).getBoundingClientRect()

        const currentRect = containerRef.current.getBoundingClientRect()

        // 编辑器的容错范围外直接隐藏
        const { x: cX } = currentRect
        if (clientX >= cX && clientX <= x && clientY >= y && clientY <= bottom) {
          return
        }
      }

      // 获取编辑器data-block-node="editor"的div
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

      // 更新坐标
      // 核心函数
      handleUpdatePosition(event)
    },
    [dragging, menuOpen, handleUpdatePosition, delayHide, horizontalDistanceThreshold, verticalDistanceThreshold]
  )

  // useCallback returns a function
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
      // 获取当前选中元素 即 data-block-node="element"
      const domElement = Editable.toDOMNode(editor, data.element)
      const prevCssText = domElement.style.cssText
      // 选中的元素的背景
      // domElement.style.cssText = ` border-radius: 3px; background-color: rgb(235 238 253 / 1); ${prevCssText}`
      domElement.classList.add('selected')
      return () => {
        // domElement.style.cssText = prevCssText
        domElement.classList.remove('selected')
      }
    }
  }, [editor, decorateOpen])

  const visible = React.useMemo(() => {
    return !!position
  }, [position]) //函数中的计算结果会被缓存，只有在依赖数组中的值发生变化时才会重新计算。

  // 判断元素是否内容为空,为空则为add,不为空就是drag
  const actionType = getCapturedData(editor)?.isEmpty ? 'add' : 'drag'

  const transformPosition = React.useMemo(() => {
    if (!position || !containerRef.current) return
    const { x, y } = position

    // 侧边栏按钮的 offsetWidth 和 clientHeight
    const { offsetWidth, clientHeight } = containerRef.current
    const data = getCapturedData(editor)

    return {
      x: x - offsetWidth - 8,
      y: data?.isVoid ? y : y - clientHeight / 2, // y 是 侧边栏悬浮按钮矩形的原点的 y 坐标
    }
  }, [position, editor])

  const isTransformAnimation = React.useMemo(() => {
    const visible = !!position
    const isAnimation = visible === prevVisibleRef.current //比较当前的 visible 状态和上一次渲染时的状态（存储在 prevVisibleRef.current 中）如果它们相同，则 isAmimation 为 true
    prevVisibleRef.current = visible //更新 ref 对象以存储当前的 visible 状态，供下一次渲染时使用
    return isAnimation
  }, [position])

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
        <StyledTooltipContentAction>{local.actionClick}</StyledTooltipContentAction>
        {local.openMenu}
      </div>,
    ]
    if (actionType === 'drag')
      contents.push(
        <div key="action-drag">
          <StyledTooltipContentAction>{local.actionDrag}</StyledTooltipContentAction>
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
        data-block-node="pmenu"
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

  const is_selecting = isBlockSelecting(editor)

  // 渲染悬浮按钮
  const renderSideBtn = () => {
    return (
      <div
        ref={containerRef}
        tw="absolute left-0 top-0 z-10 flex "
        style={{
          opacity: !is_selecting && visible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
          left: transformPosition?.x,
          top: transformPosition?.y,
          height: '24px',
          transition: isTransformAnimation ? 'all 0.1s linear 0s' : 'opacity 0.2s linear 0s', // 移位动画
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 侧边栏按钮图标 */}
        <div
          tw="flex items-center justify-center rounded-md text-xs text-gray-600 cursor-grab hover:bg-gray-200"
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

  if (dragging || menuOpen || !visible) return renderSideBtn()

  return (
    <Tooltip content={renderTooltipContent()} defaultOpen={tooltipDefaultOpen} side="top">
      {renderSideBtn()}
    </Tooltip>
  )
}
