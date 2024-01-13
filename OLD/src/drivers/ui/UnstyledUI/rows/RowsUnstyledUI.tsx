import React from 'react'
import { RowsUI } from '@entities/app/page/component/rows/RowsComponentUI'

const RowsUnstyledUI: RowsUI = {
  Rows: ({ children }) => <div>{children}</div>,
  Row: ({ children }) => <div>{children}</div>,
}

export default RowsUnstyledUI
