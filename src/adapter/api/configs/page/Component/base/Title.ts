import type { Base } from './Base'
import type { Size } from '@domain/engine/page/component/base/Title'

export interface Title extends Base {
  text: string
  size?: Size
  center?: boolean
}

export interface TitleComponent extends Title {
  component: 'Title'
}

export interface TitleBlock extends TitleComponent {
  ref: string
}

export interface TitleBlockRef extends Partial<Title> {
  component: 'Title'
  blockRef: string
}
