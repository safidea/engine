import React from 'react'
import { TitleUI } from '@entities/app/page/component/title/TitleComponentUI'

const TitleUnstyledUI: TitleUI = {
  ExtraSmall: ({ children }) => <h5 data-size="extra-small">{children}</h5>,
  Small: ({ children }) => <h4 data-size="small">{children}</h4>,
  Medium: ({ children }) => <h3 data-size="medium">{children}</h3>,
  Large: ({ children }) => <h2 data-size="large">{children}</h2>,
  ExtraLarge: ({ children }) => <h1 data-size="extra-large">{children}</h1>,
}

export default TitleUnstyledUI
