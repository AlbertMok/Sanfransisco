import { RenderElementProps, useNodeFocused, useReadOnly } from '@editablejs/editor'
import { FC } from 'react'
import tw, { css } from 'twin.macro'
import { HrEditor } from '../plugin/hr-editor'
import { Hr } from '../interfaces/hr'
import { HrPopover } from './hr-popover'
import { DEFAULT_HR_STYLE, DEFAULT_HR_WIDTH, DEFUALT_HR_COLOR } from '../constants'

export interface HrProps extends RenderElementProps<Hr> {
  editor: HrEditor
  element: Hr
}

export const HrComponent: FC<HrProps> = ({ children, attributes, editor, element }) => {
  const focused = useNodeFocused()

  const [readOnly] = useReadOnly()

  const { color = DEFUALT_HR_COLOR, width = DEFAULT_HR_WIDTH, style = DEFAULT_HR_STYLE } = element

  return (
    <HrPopover editor={editor} element={element}>
      <div data-block-id={element.id} data-block-type={element.type}>
        <div
          css={[
            tw` rounded cursor-pointer`,
            // !readOnly && tw`hover:bg-gray-100`,
            // focused && !readOnly && tw`bg-gray-100`,
            css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-top: 11px;
              padding-bottom: 11px;
            `,
          ]}
          {...attributes}
        >
          <div
            css={[
              css`
                border-top: ${width}px ${style} ${color};
              `,
            ]}
          />
          <div tw="hidden absolute">{children}</div>
        </div>
      </div>
    </HrPopover>
  )
}
