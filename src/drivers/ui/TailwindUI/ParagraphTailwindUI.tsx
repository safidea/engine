import React from 'react'
import { IUISpi } from '@entities/app/page/IUISpi'

const ParagraphTailwindUI: IUISpi['ParagraphUI'] = {
  small: ({ children }) => {
    return <p className="text-sm leading-6 text-gray-600">{children}</p>
  },
  medium: ({ children }) => {
    return <p className="text-base leading-7 text-gray-600">{children}</p>
  },
  large: ({ children }) => {
    return <p className="text-lg leading-8 text-gray-600">{children}</p>
  },
}

export default ParagraphTailwindUI
