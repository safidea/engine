import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { IUIService } from '../../../../services/ui/IUIService'
import { TitleSize } from './TitleComponentParams'

export interface TitleProps {
  size?: TitleSize
  text: string
  ui: IUIService
}

export function TitleComponentUI({ size, text, ui }: TitleProps) {
  const { ExtraSmall, Small, Medium, Large, ExtraLarge } = ui.getTitle()
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
  ExtraSmall: React.FC<BaseComponentUIProps>
  Small: React.FC<BaseComponentUIProps>
  Medium: React.FC<BaseComponentUIProps>
  Large: React.FC<BaseComponentUIProps>
  ExtraLarge: React.FC<BaseComponentUIProps>
}
