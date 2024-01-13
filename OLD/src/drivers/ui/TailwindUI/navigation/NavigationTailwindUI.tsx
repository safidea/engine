import React from 'react'
import { NavigationUI } from '@entities/app/page/component/navigation/NavigationComponentUI'
import { ApplyStyle } from '..'

const NavigationTailwindUI = (applyStyle: ApplyStyle): NavigationUI => ({
  Container: ({ children, style }) => {
    return <div className={applyStyle(style, 'h-full bg-white')}>{children}</div>
  },
  Sidebar: ({ children, style }) => {
    return (
      <div className={applyStyle(style, 'fixed inset-y-0 z-50 flex w-72 flex-col')}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 py-4">
          {children}
        </div>
      </div>
    )
  },
  LinksContainer: ({ children, style }) => {
    return (
      <nav className={applyStyle(style, 'flex flex-1 flex-col')}>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {children}
        </ul>
      </nav>
    )
  },
  LinkItem: ({ children, style }) => {
    return <li className={applyStyle(style)}>{children}</li>
  },
  Content: ({ children, style }) => {
    return (
      <div className={applyStyle(style, 'lg:pl-72')}>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    )
  },
})

export default NavigationTailwindUI
