import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'
import { ApplyStyle } from '..'

const LinkTailwindUI = (applyStyle: ApplyStyle): LinkUI => ({
  Link: ({ children, href, style }) => {
    return (
      <a className={applyStyle(style)} href={href}>
        {children}
      </a>
    )
  },
  PrimaryButton: ({ children, href, style }) => {
    return (
      <a
        href={href}
        className={applyStyle(
          style,
          'rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        )}
      >
        {children}
      </a>
    )
  },
  SecondaryButton: ({ children, href, style }) => {
    return (
      <a
        href={href}
        className={applyStyle(
          style,
          'rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
        )}
      >
        {children}
      </a>
    )
  },
})

export default LinkTailwindUI
