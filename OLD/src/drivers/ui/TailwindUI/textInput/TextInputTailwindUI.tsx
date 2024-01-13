import React from 'react'
import { TextInputUI } from '@entities/app/page/component/textInput/TextInputComponentUI'
import { ApplyStyle } from '..'

const TextInputTailwindUI = (applyStyle: ApplyStyle): TextInputUI => ({
  Label: ({ label, htmlFor, style }) => (
    <label htmlFor={htmlFor} className={applyStyle(style)}>
      {label}
    </label>
  ),
  Input: ({ name, onChange, id, value, style }) => (
    <input
      type="text"
      name={name}
      onChange={onChange}
      id={id}
      value={value}
      className={applyStyle(style)}
    />
  ),
})

export default TextInputTailwindUI
