import React from 'react'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ImageProps extends BaseComponentProps {
  url: string
  text: string
  width: number
}

export function ImageComponentUI({ url, text, ui, width }: ImageProps) {
  const { Image } = ui.getImage()
  return <Image src={url} alt={text} width={width} />
}

export interface ImageUIProps {
  src: string
  alt: string
  width: number
}

export interface ImageUI {
  Image: React.FC<ImageUIProps>
}
