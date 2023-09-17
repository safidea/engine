import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'
import React from 'react'

const TitleUnstyledUI: TitleUI = {
  ExtraSmall: ({ children }) => <h5>{children}</h5>,
  Small: ({ children }) => <h4>{children}</h4>,
  Medium: ({ children }) => <h3>{children}</h3>,
  Large: ({ children }) => <h2>{children}</h2>,
  ExtraLarge: ({ children }) => <h1>{children}</h1>,
}

export default TitleUnstyledUI
