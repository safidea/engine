import { BaseFilter, buildFilterSchema, type BaseFilterProps } from '../base'

type Props = BaseFilterProps & {
  value: number
}

export type EqualsNumberFilterConfig = Props & {
  operator: 'Equals'
}

export const equalNumberFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['Equals'] },
    value: { type: 'number' },
  },
  ['operator', 'value']
)

export class EqualsNumberFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: number
  ) {
    super(field)
  }

  toConfig(): EqualsNumberFilterConfig {
    return {
      field: this.field,
      operator: 'Equals',
      value: this.value,
    }
  }
}
