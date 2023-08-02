import React from 'react'
import {
  InputTextUIInputProps,
  IUIGateway,
  InputTextUILabelProps,
} from '@domain/gateways/IUIGateway'

const TextInputUI: IUIGateway['TextInputUI'] = {
  label: ({ label, htmlFor }: InputTextUILabelProps) => <label htmlFor={htmlFor}>{label}</label>,
  input: ({ name, onChange, id, value }: InputTextUIInputProps) => (
    <input type="text" name={name} onChange={onChange} id={id} value={value} />
  ),
}

export default TextInputUI
