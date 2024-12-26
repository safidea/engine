import { BaseFilter, type BaseFilterProps, buildFilterSchema } from '../base'

export type IsFalseBooleanFilterConfig = BaseFilterProps & {
  operator: 'IsFalse'
}

export const isFalseSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsFalse'] },
  },
  ['operator']
)

export class IsFalseBooleanFilter extends BaseFilter {
  constructor(field: string) {
    super(field)
  }

  toDto(): IsFalseBooleanFilterConfig {
    return {
      field: this.field,
      operator: 'IsFalse',
    }
  }
}
