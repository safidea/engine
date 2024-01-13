import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { ParagraphSize } from './ParagraphComponentParams'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ParagraphProps extends BaseComponentProps {
  text: string
  size?: ParagraphSize
  Icon?: () => JSX.Element
  style?: {
    paragraph?: UIStyle
  }
}

export function ParagraphComponentUI({
  text,
  size = 'medium',
  ui,
  Icon,
  style = {},
}: ParagraphProps) {
  const { Small, Medium, Large } = ui.getParagraph()
  if (Icon) {
    switch (size) {
      case 'small':
        return (
          <Small style={style.paragraph}>
            <Icon />
            {text}
          </Small>
        )
      case 'medium':
        return (
          <Medium style={style.paragraph}>
            <Icon />
            {text}
          </Medium>
        )
      case 'large':
        return (
          <Large style={style.paragraph}>
            <Icon />
            {text}
          </Large>
        )
      default:
        return (
          <Medium style={style.paragraph}>
            <Icon />
            {text}
          </Medium>
        )
    }
  }
  switch (size) {
    case 'small':
      return <Small style={style.paragraph}>{text}</Small>
    case 'medium':
      return <Medium style={style.paragraph}>{text}</Medium>
    case 'large':
      return <Large style={style.paragraph}>{text}</Large>
    default:
      return <Medium style={style.paragraph}>{text}</Medium>
  }
}

export interface ParagraphUI {
  Small: React.FC<BaseComponentUIProps>
  Medium: React.FC<BaseComponentUIProps>
  Large: React.FC<BaseComponentUIProps>
}
