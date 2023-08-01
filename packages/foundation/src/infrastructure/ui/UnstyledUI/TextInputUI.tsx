import React from 'react'
import { FormUIInputProps } from '@domain/gateways/IUIGateway'

export default function TextInputUI({ name, handleChange }: FormUIInputProps) {
  return (
    <input type="text" name={name} onChange={(e) => handleChange(e.target.name, e.target.value)} />
  )
}
