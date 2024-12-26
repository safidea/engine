import { BaseFilter, buildFilterSchema, type BaseFilterProps } from '../base'

type Props = BaseFilterProps & {
  value: string
}

export type ContainsTextFilterConfig = Props & {
  operator: 'Contains'
}

export const containsTextFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['Contains'] },
    value: { type: 'string' },
  },
  ['operator', 'value']
)

export class ContainsTextFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: string
  ) {
    super(field)
  }

  toDto(): ContainsTextFilterConfig {
    return {
      field: this.field,
      operator: 'Contains',
      value: this.value,
    }
  }
}
