import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface TextInputComponentParams extends BaseComponentParams {
  readonly type: 'text_input'
  readonly field: string
  readonly label?: string
  readonly placeholder?: string
  readonly style?: {
    readonly input?: UIStyle
    readonly label?: UIStyle
  }
}

export const TextInputComponentParams: t.Type<TextInputComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('text_input'),
    field: t.string,
  }),
  t.partial({
    label: t.string,
    placeholder: t.string,
    style: t.partial({
      input: UIStyle,
      label: UIStyle,
    }),
  }),
])
