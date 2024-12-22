import { BaseField, type BaseFieldParams } from './base'

interface SingleSelectFieldParams extends BaseFieldParams {
  options: string[]
}

export class SingleSelectField extends BaseField {
  options: string[]

  constructor(params: SingleSelectFieldParams) {
    super(params)
    this.options = params.options
  }
}
