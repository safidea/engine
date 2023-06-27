import type { AppProviderComponentsInterface } from 'shared-common'

export type CommonPropsType = {
  children?: React.ReactNode
  tag?: string
  appProviderComponents: AppProviderComponentsInterface
  router?: {
    push: (path: string) => void
  }
}
