import React from 'react'
import { TextInputUI } from '@entities/app/page/component/textInput/TextInputComponentUI'

const TextInputUnstyledUI: TextInputUI = {
  Label: ({ label, htmlFor }) => <label htmlFor={htmlFor}>{label}</label>,
  Input: ({ name, onChange, id, value }) => (
    <input type="text" name={name} onChange={onChange} id={id} value={value} />
  ),
}

export default TextInputUnstyledUI
