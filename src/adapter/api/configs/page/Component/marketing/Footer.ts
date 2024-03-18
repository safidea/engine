import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Link } from '../base/Link'

export interface Footer {
  title: Title
  paragraph: Paragraph
  links: Link[]
  copyright: string
}

export interface FooterComponent extends Footer {
  component: 'Footer'
}

export interface FooterBlock extends FooterComponent {
  ref: string
}

export interface FooterBlockRef extends Partial<Footer> {
  component: 'Footer'
  blockRef: string
}
