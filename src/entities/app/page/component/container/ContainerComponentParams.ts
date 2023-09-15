import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'

export interface ContainerComponentParams {
  type: 'container'
  components: ComponentParams[]
}

export const ContainerComponentParams: t.Type<ContainerComponentParams> = t.recursion(
  'ContainerComponentParams',
  () =>
    t.type({
      type: t.literal('container'),
      components: t.array(ComponentParams),
    })
)
