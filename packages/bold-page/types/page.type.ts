import { Meta } from './meta.page.type'
import { Layout } from './layout.page.type'

export type Page = Meta &
  Layout & {
    name: string
  }

export type { Meta, Layout }
