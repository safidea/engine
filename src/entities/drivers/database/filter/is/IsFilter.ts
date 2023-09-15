import { BaseFilter } from '../base/BaseFilter'
import { IsFilterParams } from './IsFilterParams'

export class IsFilter extends BaseFilter {
  readonly value: string

  constructor(readonly params: IsFilterParams) {
    const { field, operator, value } = params
    super({ field, operator })
    this.value = value
  }
}
