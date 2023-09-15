import React from 'react'
import { IUISpi } from '@entities/services/ui/IUISpi'

const FormTailwindUI: IUISpi['FormUI'] = {
  form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
  inputs: ({ children }) => <>{children}</>,
  input: ({ children }) => <>{children}</>,
  // TODO: replace <button type="submit"> with a button entity instance
  submit: ({ label }) => <button type="submit">{label}</button>,
  errorMessage: ({ message }) => <p>{message}</p>,
  loading: ({ label }) => <p>{label}</p>,
}

export default FormTailwindUI
