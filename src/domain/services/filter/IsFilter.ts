import { BaseFilter, type BaseFilterProps } from './base'

type IsFilterProps = BaseFilterProps & {
  value: string
}

export class IsFilter extends BaseFilter {
  readonly value: string

  constructor(filter: IsFilterProps) {
    super(filter)
    this.value = filter.value
  }
}
