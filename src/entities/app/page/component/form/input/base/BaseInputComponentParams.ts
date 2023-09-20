import * as t from 'io-ts'

export const BaseInputComponentParams = t.type({
  type: t.string,
  field: t.string,
  label: t.string,
})

export type BaseInputComponentParams = t.TypeOf<typeof BaseInputComponentParams>
