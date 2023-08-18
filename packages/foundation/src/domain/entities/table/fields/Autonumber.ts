import { BaseField } from './BaseField'

export class Autonumber extends BaseField {
  constructor(name: string) {
    super(name, 'autonumber', true, 'number')
  }
}
