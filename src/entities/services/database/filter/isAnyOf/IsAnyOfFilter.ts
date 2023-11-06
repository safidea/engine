import { BaseFilter } from '../base/BaseFilter'
import { IsAnyOfFilterParams } from './IsAnyOfFilterParams'

export class IsAnyOfFilter extends BaseFilter {
  readonly values: readonly string[]

  constructor(readonly params: IsAnyOfFilterParams) {
    const { field, operator, value } = params
    super({ field, operator })
    this.values = value
  }
}
