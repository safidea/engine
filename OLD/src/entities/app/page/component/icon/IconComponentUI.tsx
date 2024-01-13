import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'
import { IconSize } from './IconComponentParams'

export interface IconProps extends BaseComponentProps {
  name: string
  size?: IconSize
  style?: {
    icon?: UIStyle
  }
}

export function IconComponentUI({ ui, name, size = 'medium', style = {} }: IconProps) {
  const { Icon } = ui.getIcon()
  return <Icon size={size} name={name} style={style.icon} />
}

export interface IconUIProps {
  name: string
  size: IconSize
  style?: UIStyle
}

export interface IconUI {
  Icon: React.FC<IconUIProps>
}
