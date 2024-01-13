import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { TitleSize } from './TitleComponentParams'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface TitleProps extends BaseComponentProps {
  text: string
  size?: TitleSize
  style?: {
    title?: UIStyle
  }
}

export function TitleComponentUI({ size = 'medium', text, ui, testId, style = {} }: TitleProps) {
  const { ExtraSmall, Small, Medium, Large, ExtraLarge } = ui.getTitle()
  switch (size) {
    case 'extra-small':
      return (
        <ExtraSmall testId={testId} style={style.title}>
          {text}
        </ExtraSmall>
      )
    case 'small':
      return (
        <Small testId={testId} style={style.title}>
          {text}
        </Small>
      )
    case 'medium':
      return (
        <Medium testId={testId} style={style.title}>
          {text}
        </Medium>
      )
    case 'large':
      return (
        <Large testId={testId} style={style.title}>
          {text}
        </Large>
      )
    case 'extra-large':
      return (
        <ExtraLarge testId={testId} style={style.title}>
          {text}
        </ExtraLarge>
      )
    default:
      return (
        <Medium testId={testId} style={style.title}>
          {text}
        </Medium>
      )
  }
}

export interface TitleUI {
  ExtraSmall: React.FC<BaseComponentUIProps>
  Small: React.FC<BaseComponentUIProps>
  Medium: React.FC<BaseComponentUIProps>
  Large: React.FC<BaseComponentUIProps>
  ExtraLarge: React.FC<BaseComponentUIProps>
}
