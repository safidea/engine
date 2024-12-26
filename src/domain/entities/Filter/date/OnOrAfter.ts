import { BaseFilter, type BaseFilterProps, buildFilterSchema } from '../base'

type Props = BaseFilterProps & {
  operator: 'OnOrAfter'
}

export type OnOrAfterDateFilterConfig = Props & {
  value: number | string
}

export type OnOrAfterDateFilterDto = Props & {
  value: string
}

export const onOrAfterDateFilterSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['OnOrAfter'] },
    value: { oneOf: [{ type: 'number' }, { type: 'string' }] },
  },
  ['operator', 'value']
)

export class OnOrAfterDateFilter extends BaseFilter {
  readonly value: string

  constructor(field: string, value: number | string) {
    super(field)
    if (typeof value === 'number') {
      this.value = new Date(value).toISOString()
    } else {
      this.value = value
    }
  }

  toDto(): OnOrAfterDateFilterDto {
    return {
      field: this.field,
      operator: 'OnOrAfter',
      value: this.value,
    }
  }
}
