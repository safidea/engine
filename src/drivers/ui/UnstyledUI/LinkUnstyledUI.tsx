import React from 'react'
import { IUISpi } from '@entities/services/ui/IUISpi'

const LinUnstyledkUI: IUISpi['LinkUI'] = {
  link: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}

export default LinUnstyledkUI
