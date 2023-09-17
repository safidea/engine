import React from 'react'
import { ParagraphUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'

const ParagraphTailwindUI: ParagraphUI = {
  Small: ({ children }) => {
    return <p className="text-sm leading-6 text-gray-600">{children}</p>
  },
  Medium: ({ children }) => {
    return <p className="text-base leading-7 text-gray-600">{children}</p>
  },
  Large: ({ children }) => {
    return <p className="text-lg leading-8 text-gray-600">{children}</p>
  },
}

export default ParagraphTailwindUI
