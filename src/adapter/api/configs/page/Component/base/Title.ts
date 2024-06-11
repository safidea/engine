import type { Align, Size } from '@domain/engine/page/component/base/base'
import type { Base } from './Base'

export interface Title extends Base {
  text: string
  align?: Align
  size?: Size
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
