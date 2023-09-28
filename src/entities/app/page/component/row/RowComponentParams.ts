import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'

export interface RowComponentParams {
  type: 'row'
  components: ComponentParams[]
}

export const RowComponentParams: t.Type<RowComponentParams> = t.recursion(
  'RowComponentParams',
  () =>
    t.type({
      type: t.literal('row'),
      components: t.array(ComponentParams),
    })
)
