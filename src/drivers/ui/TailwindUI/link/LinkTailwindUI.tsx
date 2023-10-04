import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'

const LinkTailwindUI: LinkUI = {
  Link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
  PrimaryButton: ({ children, href }) => {
    return (
      <a
        href={href}
        className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {children}
      </a>
    )
  },
  SecondaryButton: ({ children, href }) => {
    return (
      <a
        href={href}
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {children}
      </a>
    )
  },
}

export default LinkTailwindUI
