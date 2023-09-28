import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'

const ImageTailwindUI: ImageUI = {
  Image: ({ src, alt, width }) => {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
      />
    )
  },
}

export default ImageTailwindUI
