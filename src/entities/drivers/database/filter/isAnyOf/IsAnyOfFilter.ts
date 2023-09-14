import { BaseFilter } from '../base/BaseFilter'
import { IsAnyOfFilterOptions } from './IsAnyOfFilterOptions'

export class IsAnyOfFilter extends BaseFilter {
  readonly values: string[]

  constructor(options: IsAnyOfFilterOptions) {
    const { field, operator, value } = options
    super({ field, operator })
    this.values = value
  }
}
