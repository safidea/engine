import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const SingleSelectInputComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('single_select_input'),
    field: t.string,
    options: t.array(
      t.type({
        value: t.string,
        label: t.string,
      })
    ),
  }),
  t.partial({
    label: t.string,
    placeholder: t.string,
  }),
])

export type SingleSelectInputComponentParams = t.TypeOf<typeof SingleSelectInputComponentParams>
