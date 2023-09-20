import React from 'react'
import { FormUI } from '@entities/app/page/component/form/FormComponentUI'

const FormUnstyledUI: FormUI = {
  Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,
  // TODO: replace <button type="submit"> with a button entity instance
  Submit: ({ label }) => <button type="submit">{label}</button>,
  ErrorMessage: ({ message }) => <p>{message}</p>,
  Loading: ({ label }) => <p>{label}</p>,
}

export default FormUnstyledUI
