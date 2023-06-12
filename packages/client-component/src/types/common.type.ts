import type { ConfigInterface } from 'shared-app'
import type { CustomComponents } from './component.type'
import type { FetcherProviderInterface } from 'shared-component'

export type CommonPropsType = {
  children?: React.ReactNode
  tag?: string
  config: ConfigInterface
  customComponents: CustomComponents
  fetcherProvider: FetcherProviderInterface
}
