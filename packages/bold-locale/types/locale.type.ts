import { LocaleTree } from './tree.locale.type'

export type Locale = {
  locale: string
  namespaces: {
    [namespace: string]: LocaleTree
  }
}

export type { LocaleTree }
