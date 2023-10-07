import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface RowComponentParams extends BaseComponentParams {
  type: 'row'
  components: ComponentParams[]
  style?: {
    row?: UIStyle
  }
}

export const RowComponentParams: t.Type<RowComponentParams> = t.recursion(
  'RowComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('row'),
        components: t.array(ComponentParams),
        style: t.partial({
          row: UIStyle,
        }),
      }),
    ])
)
