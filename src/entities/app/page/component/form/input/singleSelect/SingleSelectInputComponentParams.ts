import * as t from 'io-ts'
import { BaseInputComponentParams } from '../base/BaseInputComponentParams'

export const SingleSelectInputComponentParams = t.intersection([
  BaseInputComponentParams,
  t.type({
    type: t.literal('single_select'),
    placeholder: t.string,
    options: t.array(
      t.type({
        value: t.string,
        label: t.string,
      })
    ),
  }),
])

export type SingleSelectInputComponentParams = t.TypeOf<typeof SingleSelectInputComponentParams>
