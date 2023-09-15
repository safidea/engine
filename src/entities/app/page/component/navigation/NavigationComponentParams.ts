import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { LinkComponentParams } from '../link/LinkComponentParams'
import { TitleComponentParams } from '../title/TitleComponentParams'

export interface NavigationComponentParams {
  type: 'navigation'
  title: TitleComponentParams
  links: LinkComponentParams[]
  components: ComponentParams[]
}

export const NavigationComponentParams: t.Type<NavigationComponentParams> = t.recursion(
  'NavigationComponentParams',
  () =>
    t.type({
      type: t.literal('navigation'),
      title: TitleComponentParams,
      links: t.array(LinkComponentParams),
      components: t.array(ComponentParams),
    })
)
