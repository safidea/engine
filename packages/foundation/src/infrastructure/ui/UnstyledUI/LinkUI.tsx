import React from 'react'
import { LinkUIProps } from '@domain/gateways/IUIGateway'

export default function LinkUI({ children, href }: LinkUIProps) {
  return <a href={href}>{children}</a>
}
