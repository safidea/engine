import { BaseFilter } from '../base/BaseFilter'
import { IsFilterOptions } from './IsFilterOptions'

export class IsFilter extends BaseFilter {
  readonly value: string

  constructor(readonly options: IsFilterOptions) {
    const { field, operator, value } = options
    super({ field, operator })
    this.value = value
  }
}
