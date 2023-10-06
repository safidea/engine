import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

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
    style: t.partial({
      option: UIStyle,
      select: UIStyle,
      label: UIStyle,
    }),
  }),
])

export type SingleSelectRecordInputComponentParams = t.TypeOf<
  typeof SingleSelectRecordInputComponentParams
>
