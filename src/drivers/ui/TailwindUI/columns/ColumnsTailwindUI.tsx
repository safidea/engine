import React from 'react'
import { ColumnsUI } from '@entities/app/page/component/columns/ColumnsComponentUI'

const ColumnsTailwindUI: ColumnsUI = {
  Columns: ({ children }) => <div className="flex flex-row space-x-4">{children}</div>,
  Column: ({ children, number }) => {
    let basis
    switch (number) {
      case 1:
        basis = 'basis-1/1'
        break
      case 2:
        basis = 'basis-1/2'
        break
      case 3:
        basis = 'basis-1/3'
        break
      case 4:
        basis = 'basis-1/4'
        break
      case 5:
        basis = 'basis-1/5'
        break
      case 6:
        basis = 'basis-1/6'
        break
      case 7:
        basis = 'basis-1/7'
        break
      case 8:
        basis = 'basis-1/8'
        break
      case 9:
        basis = 'basis-1/9'
        break
      case 10:
        basis = 'basis-1/10'
        break
      case 11:
        basis = 'basis-1/11'
        break
      case 12:
        basis = 'basis-1/12'
        break
      default:
        basis = 'basis-1/1'
        break
    }
    return <div className={basis}>{children}</div>
  },
}

export default ColumnsTailwindUI
