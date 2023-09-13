import { AppDrivers } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { UrlFieldOptions } from './UrlFieldOptions'

export class UrlField extends BaseField {
  constructor(options: UrlFieldOptions, drivers: AppDrivers) {
    super(options, drivers)
  }
}
