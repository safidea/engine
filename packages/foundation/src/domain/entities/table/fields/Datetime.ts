import { BaseField } from './BaseField'

export class Datetime extends BaseField {
  constructor(name: string, optional?: boolean, defaultDate?: string) {
    super(name, 'datetime', optional, 'datetime', defaultDate)
  }
}