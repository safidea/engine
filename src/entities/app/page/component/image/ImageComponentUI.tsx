import React from 'react'
import { UIService } from '@entities/services/ui/UIService'

export interface ImageProps {
  url: string
  text: string
  width: number
  ui: UIService
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
