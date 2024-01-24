import type { IComponent } from '@domain/components'

export type IPageComponent = IComponent & {
  name?: string
}
