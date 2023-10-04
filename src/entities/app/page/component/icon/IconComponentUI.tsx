import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface IconProps extends BaseComponentProps {
  name: string
  size: number
}

export function IconComponentUI({ ui, name, size }: IconProps) {
  const { Icon } = ui.getIcon()
  return <Icon size={size} name={name} />
}

export interface IconUIProps {
  size: number
  name: string
}

export interface IconUI {
  Icon: React.FC<IconUIProps>
}
