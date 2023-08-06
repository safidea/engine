import React from 'react'
import { UI, UIProps } from '@adapter/spi/ui/UI'

const NavigationUI: UI['NavigationUI'] = {
  container: ({ children }: UIProps) => {
    return <div>{children}</div>
  },
  sidebar: ({ children }: UIProps) => {
    return <nav>{children}</nav>
  },
  links: ({ children }: UIProps) => {
    return <ul>{children}</ul>
  },
  link: ({ children }: UIProps) => {
    return <li>{children}</li>
  },
  content: ({ children }: UIProps) => {
    return <div>{children}</div>
  },
}

export default NavigationUI
