import { IconDrivers } from '@entities/services/icon/IconDrivers'
import React from 'react'

export interface IconProps {
  className?: string
  size: number
}

export interface IIconDriver {
  name: IconDrivers
  getByName: (name: string) => React.FC<IconProps>
}
