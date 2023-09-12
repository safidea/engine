import { BaseField } from '../base/BaseField'

export class AutonumberField extends BaseField {
  constructor(name: string) {
    super(name, 'autonumber', true, 'number')
  }
}
