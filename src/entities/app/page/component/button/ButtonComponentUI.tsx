import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ButtonProps extends BaseComponentProps {
  text: string
}

export function ButtonComponentUI({ text, ui }: ButtonProps) {
  const { Button } = ui.getButton()
  return <Button>{text}</Button>
}

export interface ButtonUI {
  Button: React.FC<BaseComponentUIProps>
}
