import * as t from 'io-ts';
import { BaseInputComponentParams } from '../base/BaseInputComponentParams'

export const TextInputComponentParams = t.intersection([
  BaseInputComponentParams,
  t.type({
    type: t.literal('text'),
    placeholder: t.string,
  }),
])

export type TextInputComponentParams = t.TypeOf<typeof TextInputComponentParams>
