import React from 'react'
import { ColumnUI } from '@entities/app/page/component/column/ColumnComponentUI'

const ColumnTailwindUI: ColumnUI = {
  Column: ({ children }) => <div className="break-after-column">{children}</div>,
}

export default ColumnTailwindUI
