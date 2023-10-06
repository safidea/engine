import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export const TextInputComponentParams = t.intersection([
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

export type TextInputComponentParams = t.TypeOf<typeof TextInputComponentParams>
