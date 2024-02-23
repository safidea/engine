import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ButtonProps extends BaseComponentProps {
  text: string
  style?: {
    button?: UIStyle
  }
}

export function ButtonComponentUI({ text, ui, style = {} }: ButtonProps) {
  const { Button } = ui.getButton()
  return <Button style={style.button}>{text}</Button>
}

export interface ButtonUI {
  Button: React.FC<BaseComponentUIProps>
}
