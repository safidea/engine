import { Meta } from './meta.page.type'
import { Layout } from './layout.page.type'

export type Page = Meta &
  Layout & {
    path: string
  }

export type { Meta, Layout }
