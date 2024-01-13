import React from 'react'
import { IconUI } from '@entities/app/page/component/icon/IconComponentUI'
import { IIconDriver } from '@adapters/mappers/driver/IIconDriver'

const IconUnstyledUI = (icon: IIconDriver): IconUI => ({
  Icon: ({ name, size }) => {
    const Icon = icon.getByName(name)
    return <Icon size={size} />
  },
})

export default IconUnstyledUI
