import { Resources } from './resources.locale.type'

export type Locale = {
  locale: string
  namespaces: {
    [namespace: string]: Resources
  }
}

export type { Resources }
