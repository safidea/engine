import React from 'react'
import { UI } from '@adapter/spi/ui/UI'

const LinkUI: UI['LinkUI'] = {
  link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinkUI
