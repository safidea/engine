import { Meta } from './meta.page.type'
import { Layout } from './layout.page.type'
import { Component, Props } from './component.page.type'

export type Page = Layout & {
  path: string
  meta: Meta
}

export type { Meta, Layout, Component, Props }
