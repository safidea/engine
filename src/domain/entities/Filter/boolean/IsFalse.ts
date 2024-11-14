import { Base, type BaseProps, buildFilterSchema } from '../base'

export type IsFalseConfig = BaseProps & {
  operator: 'IsFalse'
}

export const isFalseSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsFalse'] },
  },
  ['operator']
)

export class IsFalse extends Base {
  constructor(field: string) {
    super(field)
  }

  toConfig(): IsFalseConfig {
    return {
      field: this.field,
      operator: 'IsFalse',
    }
  }
}
