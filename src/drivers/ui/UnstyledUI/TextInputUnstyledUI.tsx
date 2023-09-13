import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'

const TextInputUnstyledUI: IUISpi['TextInputUI'] = {
  label: ({ label, htmlFor }) => <label htmlFor={htmlFor}>{label}</label>,
  input: ({ name, onChange, id, value }) => (
    <input type="text" name={name} onChange={onChange} id={id} value={value} />
  ),
}

export default TextInputUnstyledUI
