import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface SingleSelectInputProps extends BaseComponentProps {
  label?: string
  field: string
  options: { value: string; label: string }[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  style?: {
    select?: UIStyle
    label?: UIStyle
    option?: UIStyle
  }
}

export function SingleSelectInputComponentUI({
  label,
  field,
  value,
  options,
  onChange,
  ui,
  style = {},
}: SingleSelectInputProps) {
  const { Label, Select, Option } = ui.getSingleSelectInput()
  return (
    <>
      {label && <Label label={label} htmlFor={field} style={style.label} />}
      <Select onChange={onChange} name={field} id={field} value={value} style={style.select}>
        {options.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            label={option.label}
            style={style.option}
          />
        ))}
      </Select>
    </>
  )
}

export interface SingleSelectInputUIOptionProps {
  label: string
  value: string
  style?: UIStyle
}

export interface SingleSelectInputUILabelProps {
  label: string
  htmlFor: string
  style?: UIStyle
}

export interface SingleSelectInputUISelectProps {
  name: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  id: string
  children: React.ReactNode
  value: string
  style?: UIStyle
}

export interface SingleSelectInputUI {
  Label: React.FC<SingleSelectInputUILabelProps>
  Select: React.FC<SingleSelectInputUISelectProps>
  Option: React.FC<SingleSelectInputUIOptionProps>
}
