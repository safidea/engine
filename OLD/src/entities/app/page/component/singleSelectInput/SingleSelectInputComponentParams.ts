import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface SingleSelectInputComponentParams extends BaseComponentParams {
  readonly type: 'single_select_input'
  readonly field: string
  readonly options: {
    readonly value: string
    readonly label: string
  }[]
  readonly label?: string
  readonly placeholder?: string
  readonly style?: {
    readonly option?: UIStyle
    readonly select?: UIStyle
    readonly label?: UIStyle
  }
}

export const SingleSelectInputComponentParams: t.Type<SingleSelectInputComponentParams> =
  t.intersection([
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
      style: t.partial({
        option: UIStyle,
        select: UIStyle,
        label: UIStyle,
      }),
    }),
  ])
