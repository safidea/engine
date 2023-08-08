import React from 'react'
import { UI } from '@adapter/spi/ui/UI'

const TitleUI: UI['TitleUI'] = {
  xs: ({ children }) => <h5>{children}</h5>,
  sm: ({ children }) => <h4>{children}</h4>,
  md: ({ children }) => <h3>{children}</h3>,
  lg: ({ children }) => <h2>{children}</h2>,
  xl: ({ children }) => <h1>{children}</h1>,
}

export default TitleUI
