import React from 'react'
import { IconUI } from '@entities/app/page/component/icon/IconComponentUI'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'
import { ApplyStyle } from '..'

const IconTailwindUI = (applyStyle: ApplyStyle, icon: IIconDriver): IconUI => ({
  Icon: ({ name, size, style }) => {
    const Icon = icon.getByName(name)
    let width
    switch (size) {
      case 'extra-small':
        width = 'w-1 h-1'
        break
      case 'small':
        width = 'w-2 h-2'
        break
      case 'medium':
        width = 'w-4 h-4'
        break
      case 'large':
        width = 'w-8 h-8'
        break
      case 'extra-large':
        width = 'w-16 h-16'
        break
    }
    return <Icon className={applyStyle(style, width)} size={size} />
  },
})

export default IconTailwindUI
