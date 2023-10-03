import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'

export interface ContainerComponentParams extends BaseComponentParams {
  type: 'container'
  components: ComponentParams[]
}

export const ContainerWidth = t.union([
  t.literal('small'),
  t.literal('medium'),
  t.literal('large'),
  t.literal('extra-large'),
  t.literal('2-extra-large'),
])

export const ContainerComponentParams: t.Type<ContainerComponentParams> = t.recursion(
  'ContainerComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('container'),
        components: t.array(ComponentParams),
      }),
    ])
)
