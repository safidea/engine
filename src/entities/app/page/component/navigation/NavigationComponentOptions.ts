import { ComponentOptions } from '../ComponentOptions'
import { LinkComponentOptions } from '../link/LinkComponentOptions'
import { TitleComponentOptions } from '../title/TitleComponentOptions'

export interface NavigationComponentOptions {
  type: 'navigation'
  title: TitleComponentOptions
  links: LinkComponentOptions[]
  components: ComponentOptions[]
}
