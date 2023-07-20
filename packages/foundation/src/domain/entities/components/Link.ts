import { BaseComponent } from './BaseComponent'

export class Link extends BaseComponent {
  constructor(
    private readonly _href: string = '#',
    private readonly _text: string = ''
  ) {
    super('a')
  }

  get href(): string {
    return this._href
  }

  get text(): string {
    return this._text
  }
}
