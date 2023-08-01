import React from 'react'
import { IUIGateway, UIProps } from '@domain/gateways/IUIGateway'

const FormUI: IUIGateway['FormUI'] = {
  form: ({ children }: UIProps) => <form>{children}</form>,
  input: () => <input />,
}

export default FormUI
