import { IconSize } from '@entities/app/page/component/icon/IconComponentParams'
import { IconDrivers } from '@entities/services/icon/IconDrivers'
import React from 'react'

export interface IconProps {
  className?: string
  size: IconSize
}

export interface IIconDriver {
  name: IconDrivers
  getByName: (name: string) => React.FC<IconProps>
}
