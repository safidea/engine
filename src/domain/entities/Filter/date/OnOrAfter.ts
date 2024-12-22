import { BaseFilter, type BaseFilterProps, buildFilterSchema } from '../base'

type Props = BaseFilterProps & {
  value: number
}

export type OnOrAfterDateFilterConfig = Props & {
  operator: 'OnOrAfter'
}

export const onOrAfterDateFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['OnOrAfter'] },
    value: { type: 'number' },
  },
  ['operator', 'value']
)

export class OnOrAfterDateFilter extends BaseFilter {
  constructor(
    field: string,
    readonly value: number
  ) {
    super(field)
  }

  toConfig(): OnOrAfterDateFilterConfig {
    return {
      field: this.field,
      operator: 'OnOrAfter',
      value: this.value,
    }
  }
}
