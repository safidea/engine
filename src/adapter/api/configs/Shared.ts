import type { Component } from './page/component'

type SharedComponent = Component & {
  name: string
}

export interface Shared {
  components: SharedComponent[]
}
