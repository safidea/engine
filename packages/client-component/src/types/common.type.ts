import type { AppProviderComponentsInterface } from 'shared-common'

export type CommonPropsType = {
  children?: React.ReactNode
  tag?: string
  router?: {
    push: (path: string) => void
  }
}
