import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'

export const SingleSelectRecordInputComponentParams = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('single_select_record_input'),
    field: t.string,
    fieldForOptionLabel: t.string,
  }),
  t.partial({
    placeholder: t.string,
    label: t.string,
  }),
])

export type SingleSelectRecordInputComponentParams = t.TypeOf<
  typeof SingleSelectRecordInputComponentParams
>
