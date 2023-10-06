import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface TextInputComponentProps extends BaseComponentProps {
  label?: string
  field: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  style?: {
    input?: UIStyle
    label?: UIStyle
  }
}

export function TextInputComponentUI({
  label,
  field,
  onChange,
  value,
  ui,
  style = {},
}: TextInputComponentProps) {
  const { Label, Input } = ui.getTextInput()
  return (
    <>
      {label && <Label label={label} htmlFor={field} style={style.label} />}
      <Input onChange={onChange} name={field} id={field} value={value} style={style.input} />
    </>
  )
}

export interface InputTextUILabelProps {
  label: string
  htmlFor: string
  style?: UIStyle
}

export interface InputTextUIInputProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  value: string
  style?: UIStyle
}

export interface TextInputUI {
  Label: React.FC<InputTextUILabelProps>
  Input: React.FC<InputTextUIInputProps>
}
