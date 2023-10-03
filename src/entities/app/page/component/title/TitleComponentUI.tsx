import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { TitleSize } from './TitleComponentParams'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface TitleProps extends BaseComponentProps {
  size: TitleSize
  text: string
}

export function TitleComponentUI({ size, text, ui, testId }: TitleProps) {
  const { ExtraSmall, Small, Medium, Large, ExtraLarge } = ui.getTitle()
  switch (size) {
    case 'extra-small':
      return <ExtraSmall testId={testId}>{text}</ExtraSmall>
    case 'small':
      return <Small testId={testId}>{text}</Small>
    case 'medium':
      return <Medium testId={testId}>{text}</Medium>
    case 'large':
      return <Large testId={testId}>{text}</Large>
    case 'extra-large':
      return <ExtraLarge testId={testId}>{text}</ExtraLarge>
    default:
      return <Medium testId={testId}>{text}</Medium>
  }
}

export interface TitleUI {
  ExtraSmall: React.FC<BaseComponentUIProps>
  Small: React.FC<BaseComponentUIProps>
  Medium: React.FC<BaseComponentUIProps>
  Large: React.FC<BaseComponentUIProps>
  ExtraLarge: React.FC<BaseComponentUIProps>
}
