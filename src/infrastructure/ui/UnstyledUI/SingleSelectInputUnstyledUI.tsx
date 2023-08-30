import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const SingleSelectInputUnstyledUI: IUISpi['SingleSelectInputUI'] = {
  label: ({ label, htmlFor }) => <label htmlFor={htmlFor}>{label}</label>,
  select: ({ name, onChange, id, value, children }) => (
    <select name={name} onChange={onChange} id={id} value={value}>
      {children}
    </select>
  ),
  option: ({ value, label }) => <option value={value}>{label}</option>,
}

export default SingleSelectInputUnstyledUI
