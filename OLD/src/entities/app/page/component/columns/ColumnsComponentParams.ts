import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ColumnsComponentParams extends BaseComponentParams {
  readonly type: 'columns'
  readonly components: ComponentParams[]
  readonly style?: {
    readonly columns?: UIStyle
    readonly column?: UIStyle
  }
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
      t.partial({
        style: t.partial({
          columns: UIStyle,
          column: UIStyle,
        }),
      }),
    ])
)
