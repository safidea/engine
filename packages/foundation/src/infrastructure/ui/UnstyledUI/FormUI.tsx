import React from 'react'
import {
  UI,
  FormUIFormProps,
  FormUISubmitProps,
  FormUIErrorMessageProps,
  UIProps,
} from '@adapter/spi/ui/UI'

const FormUI: UI['FormUI'] = {
  form: ({ children, onSubmit }: FormUIFormProps) => <form onSubmit={onSubmit}>{children}</form>,
  inputs: ({ children }: UIProps) => <>{children}</>,
  input: ({ children }: UIProps) => <>{children}</>,
  // TODO: replace <button type="submit"> with a button entity instance
  submit: ({ label }: FormUISubmitProps) => <button type="submit">{label}</button>,
  errorMessage: ({ message }: FormUIErrorMessageProps) => <p>{message}</p>,
}

export default FormUI
