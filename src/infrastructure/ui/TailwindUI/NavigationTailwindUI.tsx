import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const NavigationTailwindUI: IUISpi['NavigationUI'] = {
  container: ({ children }) => {
    return <div>{children}</div>
  },
  sidebar: ({ children }) => {
    return <nav>{children}</nav>
  },
  links: ({ children }) => {
    return <ul>{children}</ul>
  },
  link: ({ children }) => {
    return <li>{children}</li>
  },
  content: ({ children }) => {
    return <div>{children}</div>
  },
}

export default NavigationTailwindUI
