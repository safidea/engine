import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { AutonumberFieldParams } from './AutonumberFieldParams'

export class AutonumberField extends BaseField {
  constructor(params: AutonumberFieldParams, services: AppServices) {
    super(params, services)
  }
}
