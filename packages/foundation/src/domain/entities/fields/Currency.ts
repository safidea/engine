import { BaseField } from './BaseField'

export class Currency extends BaseField {
  constructor(name: string, optional?: boolean) {
    super(name, 'currency', optional, 'number')
  }
}
