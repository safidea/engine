import { Base, type BaseProps, buildFilterSchema } from '../base'

export type IsTrueConfig = BaseProps & {
  operator: 'IsTrue'
}

export const isTrueSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsTrue'] },
  },
  ['operator']
)

export class IsTrue extends Base {
  constructor(field: string) {
    super(field)
  }

  toConfig(): IsTrueConfig {
    return {
      field: this.field,
      operator: 'IsTrue',
    }
  }
}
