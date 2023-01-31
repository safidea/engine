import type { ThemePage } from 'bold-theme'
import type { ComponentPage } from 'bold-component'

export type Layout = {
  components: ComponentPage[]
  namespaces?: string[]
  theme?: ThemePage
}
