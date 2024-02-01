import { BaseFilter, type BaseFilterProps } from './base'

type IsAnyOfFilterProps = BaseFilterProps & {
  value: string[]
}

export class IsAnyOfFilter extends BaseFilter {
  readonly value: string[]

  constructor(filter: IsAnyOfFilterProps) {
    super(filter)
    this.value = filter.value
  }
}
