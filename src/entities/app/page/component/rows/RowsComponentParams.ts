import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'

export interface RowsComponentParams {
  type: 'rows'
  components: ComponentParams[]
}

export const RowsComponentParams: t.Type<RowsComponentParams> = t.recursion(
  'RowsComponentParams',
  () =>
    t.type({
      type: t.literal('rows'),
      components: t.array(ComponentParams),
    })
)
