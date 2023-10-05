import React from 'react'
import { SingleSelectInputUI } from '@entities/app/page/component/singleSelectInput/SingleSelectInputComponentUI'

const SingleSelectInputTailwindUI: SingleSelectInputUI = {
  Label: ({ label, htmlFor }) => <label htmlFor={htmlFor}>{label}</label>,
  Select: ({ name, onChange, id, value, children }) => (
    <select name={name} onChange={onChange} id={id} value={value}>
      {children}
    </select>
  ),
  Option: ({ value, label }) => <option value={value}>{label}</option>,
}

export default SingleSelectInputTailwindUI
