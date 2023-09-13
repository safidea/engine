import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'

const LinkTailwindUI: IUISpi['LinkUI'] = {
  link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinkTailwindUI
