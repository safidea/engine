import { BaseFilter, type BaseFilterProps, buildFilterSchema } from '../base'

export type IsTrueBooleanFilterConfig = BaseFilterProps & {
  operator: 'IsTrue'
}

export const isTrueSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsTrue'] },
  },
  ['operator']
)

export class IsTrueBooleanFilter extends BaseFilter {
  constructor(field: string) {
    super(field)
  }

  toConfig(): IsTrueBooleanFilterConfig {
    return {
      field: this.field,
      operator: 'IsTrue',
    }
  }
}
