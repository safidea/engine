import * as t from 'io-ts'

export const BaseFilterParams = t.type({
  field: t.string,
  operator: t.string,
})

export type BaseFilterParams = t.TypeOf<typeof BaseFilterParams>
