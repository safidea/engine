import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'

const LinkUnstyledUI: LinkUI = {
  Link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
  PrimaryButton: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
  SecondaryButton: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinkUnstyledUI
