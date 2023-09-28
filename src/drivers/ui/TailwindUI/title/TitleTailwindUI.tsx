import React from 'react'
import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'

const TitleTailwindUI: TitleUI = {
  ExtraSmall: ({ children }) => (
    <h5 className="text-base font-semibold leading-7 text-indigo-600">{children}</h5>
  ),
  Small: ({ children }) => (
    <h4 className="text-lg font-semibold leading-8 text-gray-900">{children}</h4>
  ),
  Medium: ({ children }) => (
    <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{children}</h3>
  ),
  Large: ({ children }) => (
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-1">{children}</h2>
  ),
  ExtraLarge: ({ children }) => (
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-2">{children}</h1>
  ),
}

export default TitleTailwindUI
