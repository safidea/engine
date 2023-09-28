import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'

const ImageTailwindUI: ImageUI = {
  Image: ({ src, alt }) => {
    return <img src={src} alt={alt} />
  },
}

export default ImageTailwindUI
