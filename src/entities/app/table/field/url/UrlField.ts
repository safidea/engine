import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { UrlFieldParams } from './UrlFieldParams'

export class UrlField extends BaseField {
  constructor(params: UrlFieldParams, services: AppServices) {
    super(params, services)
  }
}
