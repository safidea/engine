import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleSelectFieldOptions } from './SingleSelectFieldOptions'

export class SingleSelectField extends BaseField {
  readonly options: string[]

  constructor(options: SingleSelectFieldOptions, drivers: AppDrivers) {
    const { options: fieldOptions, ...rest } = options
    super(rest, drivers)
    this.options = fieldOptions
  }
}
