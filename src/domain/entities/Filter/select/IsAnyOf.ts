import { BaseFilter, buildFilterSchema, type BaseFilterProps } from '../base'

type Props = BaseFilterProps & {
  value: string[]
}

export type IsAnyOfSelectFilterConfig = Props & {
  operator: 'IsAnyOf'
}

export const isAnyOfSelectFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsAnyOf'] },
    value: { type: 'array', items: { type: 'string' } },
  },
  ['operator', 'value']
)

export class IsAnyOfSelectFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: string[]
  ) {
    super(field)
  }

  toDto(): IsAnyOfSelectFilterConfig {
    return {
      field: this.field,
      operator: 'IsAnyOf',
      value: this.value,
    }
  }
}
