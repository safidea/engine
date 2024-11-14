import { Base, buildFilterSchema, type BaseProps } from '../base'

type Props = BaseProps & {
  value: string[]
}

export type IsAnyOfConfig = Props & {
  operator: 'IsAnyOf'
}

export const isAnyOfSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsAnyOf'] },
    value: { type: 'array', items: { type: 'string' } },
  },
  ['operator', 'value']
)

export class IsAnyOf extends Base {
  constructor(
    field: string,
    readonly value: string[]
  ) {
    super(field)
  }

  toConfig(): IsAnyOfConfig {
    return {
      field: this.field,
      operator: 'IsAnyOf',
      value: this.value,
    }
  }
}
