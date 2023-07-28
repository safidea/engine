import React from 'react'
import { IUIGateway, UIProps } from '@domain/gateways/IUIGateway'

const NavigationUI: IUIGateway['NavigationUI'] = {
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
