import React from 'react'
import { LinkUIProps } from '@adapter/spi/ui/UI'

export default function LinkUI({ children, href }: LinkUIProps) {
  return <a href={href}>{children}</a>
}
