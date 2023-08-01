import { BaseField } from './BaseField'

export class Currency extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: number) {
    super(name, 'currency', optional, 'number', defaultValue)
  }
}
