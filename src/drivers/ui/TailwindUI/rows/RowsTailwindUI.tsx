import React from 'react'
import { RowsUI } from '@entities/app/page/component/rows/RowsComponentUI'

const RowsTailwindUI: RowsUI = {
  Rows: ({ children }) => <div className="flex flex-col">{children}</div>,
  Row: ({ children }) => <div className="mb-4">{children}</div>,
}

export default RowsTailwindUI
