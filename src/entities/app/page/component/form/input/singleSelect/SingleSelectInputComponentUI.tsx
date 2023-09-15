import React from 'react'
import { IUIService } from '../../../../../../services/ui/IUIService'

export interface SingleSelectInputProps {
  label?: string
  field: string
  options: { value: string; label: string }[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ui: IUIService
}

export function SingleSelectInputComponentUI({
  label,
  field,
  value,
  options,
  onChange,
  ui,
}: SingleSelectInputProps) {
  const { Label, Select, Option } = ui.getSingleSelectIntput()
  return (
    <>
      {label && <Label label={label} htmlFor={field} />}
      <Select onChange={onChange} name={field} id={field} value={value}>
        {options.map((option) => (
          <Option key={option.value} value={option.value} label={option.label} />
        ))}
      </Select>
    </>
  )
}

export interface SingleSelectInputUIOptionProps {
  label: string
  value: string
}

export interface SingleSelectInputUILabelProps {
  label: string
  htmlFor: string
}

export interface SingleSelectInputUISelectProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  id: string
  children: React.ReactNode
  value: string
}

export interface SingleSelectInputUI {
  Label: React.FC<SingleSelectInputUILabelProps>
  Select: React.FC<SingleSelectInputUISelectProps>
  Option: React.FC<SingleSelectInputUIOptionProps>
}
