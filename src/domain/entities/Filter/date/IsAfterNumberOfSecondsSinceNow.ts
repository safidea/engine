import { BaseFilter, type BaseFilterProps, buildFilterSchema } from '../base'

type Props = BaseFilterProps & {
  value: number
}

export type IsAfterNumberOfSecondsSinceNowDateFilterConfig = Props & {
  operator: 'IsAfterNumberOfSecondsSinceNow'
}

export const isAfterNumberOfSecondsSinceNowDateFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsAfterNumberOfSecondsSinceNow'] },
    value: { type: 'number' },
  },
  ['operator', 'value']
)

export class IsAfterNumberOfSecondsSinceNowDateFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: number
  ) {
    super(field)
  }

  toConfig(): IsAfterNumberOfSecondsSinceNowDateFilterConfig {
    return {
      field: this.field,
      operator: 'IsAfterNumberOfSecondsSinceNow',
      value: this.value,
    }
  }
}
