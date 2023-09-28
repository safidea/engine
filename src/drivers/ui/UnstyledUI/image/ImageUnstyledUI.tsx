import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'

const ImageUnstyledUI: ImageUI = {
  Image: ({ src, alt }) => {
    return <img src={src} alt={alt} />
  },
}

export default ImageUnstyledUI
