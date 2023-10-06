import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'
import { ApplyStyle } from '..'

const ImageTailwindUI = (applyStyle: ApplyStyle): ImageUI => ({
  Image: ({ src, alt, width, style }) => {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        className={applyStyle(style, 'rounded-md shadow-2xl ring-1 ring-gray-900/10')}
      />
    )
  },
})

export default ImageTailwindUI
