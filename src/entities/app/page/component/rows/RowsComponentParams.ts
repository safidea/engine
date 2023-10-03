import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'

export interface RowsComponentParams extends BaseComponentParams {
  type: 'rows'
  components: ComponentParams[]
}

export const RowsComponentParams: t.Type<RowsComponentParams> = t.recursion(
  'RowsComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('rows'),
        components: t.array(ComponentParams),
      }),
    ])
)
