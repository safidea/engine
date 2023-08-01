import React from 'react'
import {
  IUIGateway,
  FormUIFormProps,
  FormUIInputProps,
  FormUISubmitProps,
} from '@domain/gateways/IUIGateway'

const FormUI: IUIGateway['FormUI'] = {
  form: ({ children, onSubmit }: FormUIFormProps) => <form onSubmit={onSubmit}>{children}</form>,
  input: ({ name, handleChange }: FormUIInputProps) => (
    <input name={name} onChange={(e) => handleChange(e.target.name, e.target.value)} />
  ),
  // TODO: replace <button type="submit"> with a button entity instance
  submit: ({ label }: FormUISubmitProps) => <button type="submit">{label}</button>,
}

export default FormUI
