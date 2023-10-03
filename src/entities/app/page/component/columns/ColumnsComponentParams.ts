import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'

export interface ColumnsComponentParams extends BaseComponentParams {
  type: 'columns'
  components: ComponentParams[]
}

export const ColumnsComponentParams: t.Type<ColumnsComponentParams> = t.recursion(
  'ColumnsComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('columns'),
        components: t.array(ComponentParams),
      }),
    ])
)
