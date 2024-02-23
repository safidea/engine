import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'
import { ApplyStyle } from '..'

const ImageTailwindUI = (applyStyle: ApplyStyle): ImageUI => ({
  Image: ({ src, alt, width, height, style }) => {
    return <img src={src} alt={alt} width={width} height={height} className={applyStyle(style)} />
  },
})

export default ImageTailwindUI
