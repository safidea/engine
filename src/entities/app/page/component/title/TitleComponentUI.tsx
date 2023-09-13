import React from 'react'
import { BaseUIProps } from '../base/BaseUI'
import { IUISpi } from '../../../../drivers/ui/IUISpi'
import { Size } from './TitleComponentOptions'

export interface TitleProps {
  size?: Size
  text: string
  ui: IUISpi
}

export function TitleComponentUI({ size, text, ui }: TitleProps) {
  const { ExtraSmall, Small, Medium, Large, ExtraLarge } = ui.TitleUI
  switch (size) {
    case 'extra-small':
      return <ExtraSmall>{text}</ExtraSmall>
    case 'small':
      return <Small>{text}</Small>
    case 'medium':
      return <Medium>{text}</Medium>
    case 'large':
      return <Large>{text}</Large>
    case 'extra-large':
      return <ExtraLarge>{text}</ExtraLarge>
    default:
      return <Medium>{text}</Medium>
  }
}

export interface TitleUI {
  ExtraSmall: React.FC<BaseUIProps>
  Small: React.FC<BaseUIProps>
  Medium: React.FC<BaseUIProps>
  Large: React.FC<BaseUIProps>
  ExtraLarge: React.FC<BaseUIProps>
}
