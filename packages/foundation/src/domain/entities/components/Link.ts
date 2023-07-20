import { BaseComponent } from './BaseComponent'

export class Link extends BaseComponent {
  constructor(
    /*private*/ readonly href: string = '#',
    /*private*/ readonly text: string = ''
  ) {
    super('a')
  }
}
