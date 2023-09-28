import React from 'react'
import { ColumnsUI } from '@entities/app/page/component/columns/ColumnsComponentUI'

const ColumnsTailwindUI: ColumnsUI = {
  Columns: ({ children }) => <div className="flex flex-row">{children}</div>,
  // TODO: Implement column
  /*Column: ({ children, width }) => {
    let basis
    switch (width) {
      case '1/2':
        basis = 'basis-1/2'
        break
      case '1/3':
        basis = 'basis-1/3'
        break
      case '1/4':
        basis = 'basis-1/4'
        break
      case '1/5':
        basis = 'basis-1/5'
        break
      case '1/6':
        basis = 'basis-1/6'
        break
      case '2/3':
        basis = 'basis-2/3'
        break
      case '2/4':
        basis = 'basis-2/4'
        break
      case '2/5':
        basis = 'basis-2/5'
        break
      case '2/6':
        basis = 'basis-2/6'
        break
      case '3/4':
        basis = 'basis-3/4'
        break
      case '3/5':
        basis = 'basis-3/5'
        break
      case '3/6':
        basis = 'basis-3/6'
        break
      case '4/5':
        basis = 'basis-4/5'
        break
      case '4/6':
        basis = 'basis-4/6'
        break
      case '5/6':
        basis = 'basis-5/6'
        break
      default:
        basis = 'basis-1/1'
        break
    }
    return <div className={basis}>{children}</div>
  },*/
}

export default ColumnsTailwindUI
