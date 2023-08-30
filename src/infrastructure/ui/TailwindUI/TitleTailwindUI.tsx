import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const TitleTailwindUI: IUISpi['TitleUI'] = {
  xs: ({ children }) => <p className="text-xs">{children}</p>,
  sm: ({ children }) => <p className="text-sm">{children}</p>,
  md: ({ children }) => <p className="text-base">{children}</p>,
  lg: ({ children }) => <h2 className="text-lg">{children}</h2>,
  xl: ({ children }) => <h1 className="text-xl">{children}</h1>,
}

export default TitleTailwindUI
