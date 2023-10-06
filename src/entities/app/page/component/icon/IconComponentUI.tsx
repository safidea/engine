import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface IconProps extends BaseComponentProps {
  name: string
  size?: number
  style?: {
    icon?: UIStyle
  }
}

export function IconComponentUI({ ui, name, size = 5, style = {} }: IconProps) {
  const { Icon } = ui.getIcon()
  return <Icon size={size} name={name} style={style.icon} />
}

export interface IconUIProps {
  size: number
  name: string
  style?: UIStyle
}

export interface IconUI {
  Icon: React.FC<IconUIProps>
}
