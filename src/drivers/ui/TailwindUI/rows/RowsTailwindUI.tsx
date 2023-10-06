import React from 'react'
import { RowsUI } from '@entities/app/page/component/rows/RowsComponentUI'
import { ApplyStyle } from '..'

const RowsTailwindUI = (applyStyle: ApplyStyle): RowsUI => ({
  Rows: ({ children, style }) => (
    <div className={applyStyle(style, 'flex flex-col')}>{children}</div>
  ),
  Row: ({ children, style }) => <div className={applyStyle(style, 'mb-4')}>{children}</div>,
})

export default RowsTailwindUI
