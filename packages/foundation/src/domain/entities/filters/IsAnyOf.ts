import { BaseFilter } from './BaseFilter'

export class IsAnyOf extends BaseFilter {
  constructor(
    field: string,
    private readonly _values: string[] | number[] | boolean[]
  ) {
    super(field, 'is_any_of')
  }

  get values(): string[] | number[] | boolean[] {
    return this._values
  }
}
