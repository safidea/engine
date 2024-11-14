import { Base, buildFilterSchema, type BaseProps } from '../base'

type Props = BaseProps & {
  value: number
}

export type EqualsConfig = Props & {
  operator: 'Equals'
}

export const equalSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['Equals'] },
    value: { type: 'number' },
  },
  ['operator', 'value']
)

export class Equals extends Base {
  constructor(
    field: string,
    readonly value: number
  ) {
    super(field)
  }

  toConfig(): EqualsConfig {
    return {
      field: this.field,
      operator: 'Equals',
      value: this.value,
    }
  }
}
