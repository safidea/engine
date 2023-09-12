import React from 'react'
import { IUISpi } from '@entities/app/page/IUISpi'

const LinkTailwindUI: IUISpi['LinkUI'] = {
  link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinkTailwindUI
