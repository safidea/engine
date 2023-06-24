import type { ServerProviderComponentsInterface } from 'shared-common'

export type CommonPropsType = {
  children?: React.ReactNode
  tag?: string
  serverProviderComponents: ServerProviderComponentsInterface
}
