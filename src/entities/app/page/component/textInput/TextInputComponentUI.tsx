import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface TextInputComponentProps extends BaseComponentProps {
  label?: string
  field: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

export function TextInputComponentUI({
  label,
  field,
  onChange,
  value,
  ui,
}: TextInputComponentProps) {
  const { Label, Input } = ui.getTextInput()
  return (
    <>
      {label && <Label label={label} htmlFor={field} />}
      <Input onChange={onChange} name={field} id={field} value={value} />
    </>
  )
}

export interface InputTextUILabelProps {
  label: string
  htmlFor: string
}

export interface InputTextUIInputProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  value: string
}

export interface TextInputUI {
  Label: React.FC<InputTextUILabelProps>
  Input: React.FC<InputTextUIInputProps>
}
