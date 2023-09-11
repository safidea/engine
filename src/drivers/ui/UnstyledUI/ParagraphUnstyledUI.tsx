import React from 'react'
import { IUISpi } from '@entities/spi/IUISpi'

const ParagraphUnstyledUI: IUISpi['ParagraphUI'] = {
  small: ({ children }) => {
    return <p>{children}</p>
  },
  medium: ({ children }) => {
    return <p>{children}</p>
  },
  large: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphUnstyledUI
