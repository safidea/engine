import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const TextInputComponentParams = t.intersection([
  BaseComponentParams,
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
