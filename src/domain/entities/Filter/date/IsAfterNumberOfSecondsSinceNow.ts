import { Base, type BaseProps, buildFilterSchema } from '../base'

type Props = BaseProps & {
  value: number
}

export type IsAfterNumberOfSecondsSinceNowConfig = Props & {
  operator: 'IsAfterNumberOfSecondsSinceNow'
}

export const isAfterNumberOfSecondsSinceNowSchema = buildFilterSchema(
  {
    operator: { type: 'string', enum: ['IsAfterNumberOfSecondsSinceNow'] },
    value: { type: 'number' },
  },
  ['operator', 'value']
)

export class IsAfterNumberOfSecondsSinceNow extends Base {
  constructor(
    field: string,
    readonly value: number
  ) {
    super(field)
  }

  toConfig(): IsAfterNumberOfSecondsSinceNowConfig {
    return {
      field: this.field,
      operator: 'IsAfterNumberOfSecondsSinceNow',
      value: this.value,
    }
  }
}
