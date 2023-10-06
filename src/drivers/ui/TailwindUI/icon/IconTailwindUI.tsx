import React from 'react'
import { IconUI } from '@entities/app/page/component/icon/IconComponentUI'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'
import { ApplyStyle } from '..'

const IconTailwindUI = (applyStyle: ApplyStyle, icon: IIconDriver): IconUI => ({
  Icon: ({ name, size, style }) => {
    const Icon = icon.getByName(name)
    let width
    switch (size) {
      case 1:
        width = 'w-1 h-1'
        break
      case 2:
        width = 'w-2 h-2'
        break
      case 3:
        width = 'w-3 h-3'
        break
      case 4:
        width = 'w-4 h-4'
        break
      case 5:
        width = 'w-5 h-5'
        break
      case 6:
        width = 'w-6 h-6'
        break
      case 7:
        width = 'w-7 h-7'
        break
      case 8:
        width = 'w-8 h-8'
        break
      case 9:
        width = 'w-9 h-9'
        break
      case 10:
        width = 'w-10 h-10'
        break
      case 11:
        width = 'w-11 h-11'
        break
      case 12:
        width = 'w-12 h-12'
        break
      default:
        width = 'w-5 h-5'
        break
    }
    return <Icon className={applyStyle(style, width)} size={size} />
  },
})

export default IconTailwindUI
