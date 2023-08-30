import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const ParagraphTailwindUI: IUISpi['ParagraphUI'] = {
  paragraph: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphTailwindUI
