import * as t from 'io-ts'
import { ComponentParams } from '../ComponentParams'
import { LinkComponentParams } from '../link/LinkComponentParams'
import { TitleComponentParams } from '../title/TitleComponentParams'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface NavigationComponentParams extends BaseComponentParams {
  type: 'navigation'
  title: TitleComponentParams
  links: LinkComponentParams[]
  components: ComponentParams[]
  style?: {
    container?: UIStyle
    sidebar?: UIStyle
    title?: UIStyle
    linksContainer?: UIStyle
    linkItem?: UIStyle
    content?: UIStyle
  }
}

export const NavigationComponentParams: t.Type<NavigationComponentParams> = t.recursion(
  'NavigationComponentParams',
  () =>
    t.intersection([
      BaseComponentParams,
      t.type({
        type: t.literal('navigation'),
        title: TitleComponentParams,
        links: t.array(LinkComponentParams),
        components: t.array(ComponentParams),
      }),
      t.partial({
        style: t.partial({
          container: UIStyle,
          sidebar: UIStyle,
          title: UIStyle,
          linksContainer: UIStyle,
          linkItem: UIStyle,
          content: UIStyle,
        }),
      }),
    ])
)
