import React from 'react'
import { IUISpi } from '@domain/spi/IUISpi'

const ParagraphUnstyledUI: IUISpi['ParagraphUI'] = {
  paragraph: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphUnstyledUI
