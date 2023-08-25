import { BaseFilter } from './BaseFilter'

export class IsAnyOfFilter extends BaseFilter {
  constructor(
    field: string,
    private readonly _values: string[]
  ) {
    super(field, 'is_any_of')
  }

  get values(): string[] {
    return this._values
  }
}
