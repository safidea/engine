import * as t from 'io-ts'
import { BaseFieldParams } from '../base/BaseFieldParams'

export interface UrlFieldParams extends BaseFieldParams {
  readonly type: 'url'
}

export const UrlFieldParams: t.Type<UrlFieldParams> = t.intersection([
  BaseFieldParams,
  t.type({
    type: t.literal('url'),
  }),
])
