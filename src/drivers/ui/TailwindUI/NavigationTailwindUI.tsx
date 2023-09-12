import React from 'react'
import { IUISpi } from '@entities/app/page/IUISpi'

const NavigationTailwindUI: IUISpi['NavigationUI'] = {
  container: ({ children }) => {
    return <div className="h-full bg-white">{children}</div>
  },
  sidebar: ({ children }) => {
    return (
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 py-4">
          {children}
        </div>
      </div>
    )
  },
  links: ({ children }) => {
    return (
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {children}
        </ul>
      </nav>
    )
  },
  link: ({ children }) => {
    return <li>{children}</li>
  },
  content: ({ children }) => {
    return (
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    )
  },
}

export default NavigationTailwindUI
