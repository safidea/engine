import { BaseField } from '../base/BaseField'

export class DatetimeField extends BaseField {
  constructor(name: string, optional?: boolean, defaultDate?: string) {
    super(name, 'datetime', optional, 'datetime', defaultDate)
  }
}
