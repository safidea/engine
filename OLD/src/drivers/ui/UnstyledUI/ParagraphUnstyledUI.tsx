import React from 'react'
import { ParagraphUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'

const ParagraphUnstyledUI: ParagraphUI = {
  Small: ({ children }) => {
    return <p>{children}</p>
  },
  Medium: ({ children }) => {
    return <p>{children}</p>
  },
  Large: ({ children }) => {
    return <p>{children}</p>
  },
}

export default ParagraphUnstyledUI
