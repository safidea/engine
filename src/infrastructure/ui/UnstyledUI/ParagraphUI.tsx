import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const ParagraphUI: IUISpi['ParagraphUI'] = {
  paragraph: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphUI
