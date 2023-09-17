import React from 'react'
import { LinkUI } from '@entities/app/page/component/link/LinkComponentUI'

const LinUnstyledkUI: LinkUI = {
  Link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinUnstyledkUI
