import { BaseFilter, buildFilterSchema, type BaseFilterProps } from '../base'

type Props = BaseFilterProps & {
  value: string
}

export type IsTextFilterConfig = Props & {
  operator: 'Is'
}

export const isTextFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['Is'] },
    value: { type: 'string' },
  },
  ['operator', 'value']
)

export class IsTextFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: string
  ) {
    super(field)
  }

  toConfig(): IsTextFilterConfig {
    return {
      field: this.field,
      operator: 'Is',
      value: this.value,
    }
  }
}
