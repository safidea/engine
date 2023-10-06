import React from 'react'
import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'
import { ApplyStyle } from '..'

const TitleTailwindUI = (applyStyle: ApplyStyle): TitleUI => ({
  ExtraSmall: ({ children, style }) => (
    <h5
      className={applyStyle(style, 'text-base font-semibold leading-7 text-indigo-600')}
      data-size="extra-small"
    >
      {children}
    </h5>
  ),
  Small: ({ children, style }) => (
    <h4
      className={applyStyle(style, 'text-lg font-semibold leading-8 text-gray-900')}
      data-size="small"
    >
      {children}
    </h4>
  ),
  Medium: ({ children, style }) => (
    <h3
      className={applyStyle(style, 'text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl')}
      data-size="medium"
    >
      {children}
    </h3>
  ),
  Large: ({ children, style }) => (
    <h2
      className={applyStyle(
        style,
        'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-1'
      )}
      data-size="large"
    >
      {children}
    </h2>
  ),
  ExtraLarge: ({ children, style }) => (
    <h1
      className={applyStyle(
        style,
        'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-2'
      )}
      data-size="extra-large"
    >
      {children}
    </h1>
  ),
})

export default TitleTailwindUI
