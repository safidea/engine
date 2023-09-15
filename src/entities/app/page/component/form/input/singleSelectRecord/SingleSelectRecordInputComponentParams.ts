import * as t from 'io-ts'
import { BaseInputComponentParams } from '../base/BaseInputComponentParams'

export const SingleSelectRecordInputComponentParams = t.intersection([
  BaseInputComponentParams,
  t.type({
    type: t.literal('single_select_record'),
    placeholder: t.string,
    table: t.string,
    fieldForOptionLabel: t.string,
  }),
])

export type SingleSelectRecordInputComponentParams = t.TypeOf<
  typeof SingleSelectRecordInputComponentParams
>
