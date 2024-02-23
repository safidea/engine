import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface RowsComponentParams extends BaseComponentParams {
  type: 'rows'
  components: ComponentParams[]
  style?: {
    rows?: UIStyle
    row?: UIStyle
  }
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
      t.partial({
        style: t.partial({
          rows: UIStyle,
          row: UIStyle,
        }),
      }),
    ])
)
