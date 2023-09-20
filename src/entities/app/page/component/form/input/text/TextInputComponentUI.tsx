import { UIService } from '@entities/services/ui/UIService'
import React from 'react'

export interface TextInputComponentUIProps {
  label?: string
  field: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  ui: UIService
}

export function TextInputComponentUI({
  label,
  field,
  onChange,
  value,
  ui,
}: TextInputComponentUIProps) {
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
