import React from 'react'
import { InputTextUIInputProps, UI, InputTextUILabelProps } from '@adapter/spi/ui/UI'

const TextInputUI: UI['TextInputUI'] = {
  label: ({ label, htmlFor }: InputTextUILabelProps) => <label htmlFor={htmlFor}>{label}</label>,
  input: ({ name, onChange, id, value }: InputTextUIInputProps) => (
    <input type="text" name={name} onChange={onChange} id={id} value={value} />
  ),
}

export default TextInputUI
