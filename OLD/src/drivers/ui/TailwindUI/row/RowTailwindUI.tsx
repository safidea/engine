import React from 'react'
import { RowUI } from '@entities/app/page/component/row/RowComponentUI'
import { ApplyStyle } from '..'

const RowTailwindUI = (applyStyle: ApplyStyle): RowUI => ({
  Row: ({ children, style }) => <div className={applyStyle(style)}>{children}</div>,
})

export default RowTailwindUI
