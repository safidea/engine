import { BaseComponent } from './BaseComponent'

export class Paragraph extends BaseComponent {
  constructor(private readonly text: string = '') {
    super('p')
  }
}
