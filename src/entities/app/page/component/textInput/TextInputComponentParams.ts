import * as t from 'io-ts'

export const TextInputComponentParams = t.intersection([
  t.type({
    type: t.literal('text_input'),
    field: t.string,
  }),
  t.partial({
    label: t.string,
    placeholder: t.string,
  }),
])

export type TextInputComponentParams = t.TypeOf<typeof TextInputComponentParams>
