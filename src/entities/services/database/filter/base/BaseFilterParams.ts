import * as t from 'io-ts'

export type BaseFilterParams = {
  readonly field: string
  readonly operator: string
}

export const BaseFilterParams: t.Type<BaseFilterParams> = t.type({
  field: t.string,
  operator: t.string,
})
