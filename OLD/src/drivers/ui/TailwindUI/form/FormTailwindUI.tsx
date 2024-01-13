import React from 'react'
import { FormUI } from '@entities/app/page/component/form/FormComponentUI'
import { ApplyStyle } from '..'

const FormTailwindUI = (applyStyle: ApplyStyle): FormUI => ({
  Form: ({ children, onSubmit, style }) => (
    <form className={applyStyle(style)} onSubmit={onSubmit}>
      {children}
    </form>
  ),
  // TODO: replace <button type="submit"> with a button entity instance
  Submit: ({ label, style }) => (
    <button className={applyStyle(style)} type="submit">
      {label}
    </button>
  ),
  ErrorMessage: ({ message, style }) => <p className={applyStyle(style)}>{message}</p>,
  Loading: ({ label, style }) => <p className={applyStyle(style)}>{label}</p>,
})

export default FormTailwindUI
