import type { ConfigInterface } from 'shared-app'
import type { CustomComponents } from './component.type'

export type CommonPropsType = {
  children?: React.ReactNode
  tag?: string
  config: ConfigInterface
  customComponents: CustomComponents
}
