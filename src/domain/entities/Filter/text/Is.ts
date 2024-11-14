import { Base, buildFilterSchema, type BaseProps } from '../base'

type Props = BaseProps & {
  value: string
}

export type IsConfig = Props & {
  operator: 'Is'
}

export const isSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['Is'] },
    value: { type: 'string' },
  },
  ['operator', 'value']
)

export class Is extends Base {
  constructor(
    field: string,
    readonly value: string
  ) {
    super(field)
  }

  toConfig(): IsConfig {
    return {
      field: this.field,
      operator: 'Is',
      value: this.value,
    }
  }
}
