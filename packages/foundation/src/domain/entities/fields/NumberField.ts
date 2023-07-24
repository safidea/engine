import { BaseField } from './BaseField'

export class NumberField extends BaseField {
  constructor(name: string, optional?: boolean) {
    super(name, 'number', optional, 'number')
  }
}