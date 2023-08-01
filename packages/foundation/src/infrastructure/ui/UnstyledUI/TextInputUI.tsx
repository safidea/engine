import React from 'react'
import { FormUIInputProps } from '@domain/gateways/IUIGateway'

export default function TextInputUI({ name, onChange }: FormUIInputProps) {
  return (
    <input type="text" name={name} onChange={onChange} />
  )
}
