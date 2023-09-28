import React from 'react'
import { UIService } from '@entities/services/ui/UIService'

export interface ImageProps {
  url: string
  text: string
  ui: UIService
}

export function ImageComponentUI({ url, text, ui }: ImageProps) {
  const { Image } = ui.getImage()
  return <Image src={url} alt={text} />
}

export interface ImageUIProps {
  src: string
  alt: string
}

export interface ImageUI {
  Image: React.FC<ImageUIProps>
}
