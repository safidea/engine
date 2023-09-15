import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleSelectFieldParams } from './SingleSelectFieldParams'

export class SingleSelectField extends BaseField {
  readonly options: string[]

  constructor(params: SingleSelectFieldParams, drivers: AppDrivers) {
    const { options, ...rest } = params
    super(rest, drivers)
    this.options = options
  }
}
