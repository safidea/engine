import { Meta } from './meta.page.type'
import { Component, Props } from './component.page.type'

export type Page = {
  path: string
  meta: Meta
  components: Component[]
}

export type { Meta, Component, Props }
