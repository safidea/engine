import React from 'react'
import { IUISpi } from '../../../../services/ui/IUISpi'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { ParagraphSize } from './ParagraphComponentParams'

export interface ParagraphProps {
  text: string
  size?: ParagraphSize
  ui: IUISpi
}

export function ParagraphComponentUI({ text, size, ui }: ParagraphProps) {
  const { Small, Medium, Large } = ui.ParagraphUI
  switch (size) {
    case 'small':
      return <Small>{text}</Small>
    case 'medium':
      return <Medium>{text}</Medium>
    case 'large':
      return <Large>{text}</Large>
    default:
      return <Medium>{text}</Medium>
  }
}

export interface ParagraphUI {
  Small: React.FC<BaseComponentUIProps>
  Medium: React.FC<BaseComponentUIProps>
  Large: React.FC<BaseComponentUIProps>
}
