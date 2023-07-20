import { BaseComponent } from './BaseComponent'

export class Paragraph extends BaseComponent {
  constructor(private readonly _text: string = '') {
    super('p')
  }

  get text(): string {
    return this._text
  }
}
