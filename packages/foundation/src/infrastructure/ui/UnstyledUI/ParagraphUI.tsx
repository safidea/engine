import React from 'react'
import { UI } from '@adapter/spi/ui/UI'

const ParagraphUI: UI['ParagraphUI'] = {
  paragraph: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphUI
