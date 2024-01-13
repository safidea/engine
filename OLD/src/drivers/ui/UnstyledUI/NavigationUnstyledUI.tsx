import React from 'react'
import { NavigationUI } from '@entities/app/page/component/navigation/NavigationComponentUI'

const NavigationUnstyledUI: NavigationUI = {
  Container: ({ children }) => {
    return <div>{children}</div>
  },
  Sidebar: ({ children }) => {
    return <nav>{children}</nav>
  },
  LinksContainer: ({ children }) => {
    return <ul>{children}</ul>
  },
  LinkItem: ({ children }) => {
    return <li>{children}</li>
  },
  Content: ({ children }) => {
    return <div>{children}</div>
  },
}

export default NavigationUnstyledUI
