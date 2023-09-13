import { ComponentOptions } from './component/ComponentOptions'

export interface PageOptions {
  path: string
  components: ComponentOptions[]
  title?: string
}
