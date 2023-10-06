import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'
import { ApplyStyle } from '..'
import { ButtonSize } from '@entities/app/page/component/button/ButtonComponentParams'

const getButtonSize = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'extra-small':
      return 'px-2 py-1 text-xs'
    case 'small':
      return 'px-2 py-1 text-sm '
    case 'medium':
      return 'px-2.5 py-1.5 text-sm'
    case 'large':
      return 'px-3 py-2 text-sm'
    case 'extra-large':
      return 'px-3.5 py-2.5 text-sm'
  }
}

const LinkTailwindUI = (applyStyle: ApplyStyle): LinkUI => ({
  Link: ({ children, href, style }) => {
    return (
      <a className={applyStyle(style)} href={href}>
        {children}
      </a>
    )
  },
  PrimaryButton: ({ children, href, style, size }) => {
    return (
      <a
        href={href}
        className={applyStyle(
          style,
          getButtonSize(size) +
            ' rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        )}
      >
        {children}
      </a>
    )
  },
  SecondaryButton: ({ children, href, style, size }) => {
    return (
      <a
        href={href}
        className={applyStyle(
          style,
          getButtonSize(size) +
            ' rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        )}
      >
        {children}
      </a>
    )
  },
})

export default LinkTailwindUI
