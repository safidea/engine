import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'

export interface ColumnsComponentParams extends BaseComponentParams {
  type: 'columns'
  components: ComponentParams[]
  style?: {
    columns?: {
      background?: {
        color?: 'gray-100'
      }
    }
    column?: string
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
          columns: t.partial({
            background: t.partial({
              color: t.literal('gray-100'),
            }),
          }),
          column: t.string,
        }),
      }),
    ])
)
