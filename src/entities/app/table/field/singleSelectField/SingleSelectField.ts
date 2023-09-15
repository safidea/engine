import { AppServices } from '@entities/app/App'
import { BaseField } from '../base/BaseField'
import { SingleSelectFieldParams } from './SingleSelectFieldParams'

export class SingleSelectField extends BaseField {
  readonly options: string[]

  constructor(params: SingleSelectFieldParams, services: AppServices) {
    const { options, ...rest } = params
    super(rest, services)
    this.options = options
  }
}
