import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'

const SingleSelectRecordInputTailwindUI: IUISpi['SingleSelectRecordInputUI'] = {
  label: ({ label, htmlFor }) => <label htmlFor={htmlFor}>{label}</label>,
  select: ({ name, onChange, id, value, children }) => (
    <select name={name} onChange={onChange} id={id} value={value}>
      {children}
    </select>
  ),
  option: ({ value, label }) => <option value={value}>{label}</option>,
}

export default SingleSelectRecordInputTailwindUI
