import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'
import { ApplyStyle } from '..'
import { ButtonSize } from '@entities/app/page/component/button/ButtonComponentParams'

const getButtonSize = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'extra-small':
      return 'px-2 py-1 text-xs gap-x-1'
    case 'small':
      return 'px-2 py-1 text-sm gap-x-1.5'
    case 'medium':
      return 'px-2.5 py-1.5 text-sm gap-x-1.5'
    case 'large':
      return 'px-3 py-2 text-sm gap-x-1.5'
    case 'extra-large':
      return 'px-3.5 py-2.5 text-sm gap-x-2'
  }
}

const LinkTailwindUI = (applyStyle: ApplyStyle): LinkUI => ({
  Link: ({ children, href, style, size }) => {
    return (
      <a
        className={applyStyle(
          style,
          getButtonSize(size) + ' inline-flex items-center font-semibold'
        )}
        href={href}
      >
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
            ' inline-flex items-center font-semibold rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
            ' inline-flex items-center font-semibold rounded-md bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        )}
      >
        {children}
      </a>
    )
  },
})

export default LinkTailwindUI
