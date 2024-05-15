import type { Base } from './Base'

export interface Image extends Base {
  src: string
  alt: string
}

export interface ImageComponent extends Image {
  component: 'Image'
}

export interface ImageBlock extends ImageComponent {
  ref: string
}

export interface ImageBlockRef extends Partial<Image> {
  component: 'Image'
  blockRef: string
}
