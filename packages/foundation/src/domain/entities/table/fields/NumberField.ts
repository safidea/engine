import { BaseField } from './BaseField'

export class NumberField extends BaseField {
  constructor(name: string, optional?: boolean, defaultValue?: number) {
    super(name, 'number', optional, 'number', defaultValue)
  }
}
