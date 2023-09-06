import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const TitleTailwindUI: IUISpi['TitleUI'] = {
  xs: ({ children }) => (
    <h5 className="text-base font-semibold leading-7 text-indigo-600">{children}</h5>
  ),
  sm: ({ children }) => (
    <h4 className="text-lg font-semibold leading-8 text-gray-900">{children}</h4>
  ),
  md: ({ children }) => (
    <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{children}</h3>
  ),
  lg: ({ children }) => (
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{children}</h2>
  ),
  xl: ({ children }) => (
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">{children}</h1>
  ),
}

export default TitleTailwindUI
