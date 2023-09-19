import * as t from 'io-ts'

export const BaseInputComponentParams = t.intersection([
  t.type({
    field: t.string,
    label: t.string,
  }),
  t.partial({
    type: t.string,
  }),
])

export type BaseInputComponentParams = t.TypeOf<typeof BaseInputComponentParams>
