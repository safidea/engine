import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'

export interface ColumnComponentParams {
  type: 'column'
  components: ComponentParams[]
}

export const ColumnComponentParams: t.Type<ColumnComponentParams> = t.recursion(
  'ColumnComponentParams',
  () =>
    t.type({
      type: t.literal('column'),
      components: t.array(ComponentParams),
    })
)
