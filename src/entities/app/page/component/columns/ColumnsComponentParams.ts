import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'

export interface ColumnsComponentParams {
  type: 'columns'
  components: ComponentParams[]
}

export const ColumnsComponentParams: t.Type<ColumnsComponentParams> = t.recursion(
  'ColumnsComponentParams',
  () =>
    t.type({
      type: t.literal('columns'),
      components: t.array(ComponentParams),
    })
)
