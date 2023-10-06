import React from 'react'
import { ParagraphUI } from '@entities/app/page/component/paragraph/ParagraphComponentUI'
import { ApplyStyle } from '..'

const ParagraphTailwindUI = (applyStyle: ApplyStyle): ParagraphUI => ({
  Small: ({ children, style }) => {
    return <p className={applyStyle(style, 'text-sm leading-6 text-gray-600')}>{children}</p>
  },
  Medium: ({ children, style }) => {
    return <p className={applyStyle(style, 'text-base leading-7 text-gray-600')}>{children}</p>
  },
  Large: ({ children, style }) => {
    return <p className={applyStyle(style, 'text-lg leading-8 text-gray-600')}>{children}</p>
  },
})

export default ParagraphTailwindUI
