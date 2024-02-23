import React from 'react'
import { SingleSelectInputUI } from '@entities/app/page/component/singleSelectInput/SingleSelectInputComponentUI'
import { ApplyStyle } from '..'

const SingleSelectInputTailwindUI = (applyStyle: ApplyStyle): SingleSelectInputUI => ({
  Label: ({ label, htmlFor, style }) => (
    <label className={applyStyle(style)} htmlFor={htmlFor}>
      {label}
    </label>
  ),
  Select: ({ name, onChange, id, value, children, style }) => (
    <select className={applyStyle(style)} name={name} onChange={onChange} id={id} value={value}>
      {children}
    </select>
  ),
  Option: ({ value, label, style }) => (
    <option className={applyStyle(style)} value={value}>
      {label}
    </option>
  ),
})

export default SingleSelectInputTailwindUI
