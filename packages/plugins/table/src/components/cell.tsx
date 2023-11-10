import { css, styled } from 'twin.macro'

export const CellStyles = styled.td(() => [
  css`
    border: 1px solid var(--table-border-color);
    vertical-align: top;
  `,
])

export const CellInnerStyles = styled.div(() => [
  css`
    padding: 6px;
  `,
])
