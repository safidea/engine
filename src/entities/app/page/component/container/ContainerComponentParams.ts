import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ContainerComponentParams extends BaseComponentParams {
  type: 'container'
  components: ComponentParams[]
  style?: {
    container?: UIStyle
    section?: UIStyle
  }
}

export const ContainerComponentParams: t.Type<ContainerComponentParams> = t.recursion(
  'ContainerComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('container'),
        components: t.array(ComponentParams),
      }),
      t.partial({
        style: t.partial({
          container: UIStyle,
          section: UIStyle,
        }),
      }),
    ])
)
