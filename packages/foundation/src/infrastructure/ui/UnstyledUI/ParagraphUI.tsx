import React from 'react'
import { UIProps } from '@adapter/spi/ui/UI'

export default function ParagraphUI({ children }: UIProps) {
  return <p>{children}</p>
}
