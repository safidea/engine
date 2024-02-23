import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface SingleSelectRecordInputComponentParams extends BaseComponentParams {
  readonly type: 'single_select_record_input'
  readonly field: string
  readonly fieldForOptionLabel: string
  readonly placeholder?: string
  readonly label?: string
  readonly style?: {
    readonly option?: UIStyle
    readonly select?: UIStyle
    readonly label?: UIStyle
  }
}

export const SingleSelectRecordInputComponentParams: t.Type<SingleSelectRecordInputComponentParams> =
  t.intersection([
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
