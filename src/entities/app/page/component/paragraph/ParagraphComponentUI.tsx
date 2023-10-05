import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { ParagraphSize } from './ParagraphComponentParams'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ParagraphProps extends BaseComponentProps {
  text: string
  size: ParagraphSize
  Icon?: () => JSX.Element
}

export function ParagraphComponentUI({ text, size, ui, Icon }: ParagraphProps) {
  const { Small, Medium, Large } = ui.getParagraph()
  if (Icon) {
    switch (size) {
      case 'small':
        return (
          <Small>
            <Icon />
            {text}
          </Small>
        )
      case 'medium':
        return (
          <Medium>
            <Icon />
            {text}
          </Medium>
        )
      case 'large':
        return (
          <Large>
            <Icon />
            {text}
          </Large>
        )
      default:
        return (
          <Medium>
            <Icon />
            {text}
          </Medium>
        )
    }
  }
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
