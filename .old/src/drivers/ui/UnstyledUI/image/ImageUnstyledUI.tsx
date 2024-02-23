import React from 'react'
import { ImageUI } from '@entities/app/page/component/image/ImageComponentUI'

const ImageUnstyledUI: ImageUI = {
  Image: ({ src, alt, width }) => {
    return <img src={src} alt={alt} width={width} />
  },
}

export default ImageUnstyledUI
