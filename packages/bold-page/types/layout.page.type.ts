import type { Component } from './component.page.type'

export type Layout = {
  components: Component[]
  namespaces?: string[]
  hasContainer?: boolean
  fontsVariables?: string[]
}
