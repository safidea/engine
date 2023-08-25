import { BaseFilter } from './BaseFilter'

export class IsFilter extends BaseFilter {
  constructor(
    field: string,
    private readonly _value: string
  ) {
    super(field, 'is')
  }

  get value(): string {
    return this._value
  }
}
