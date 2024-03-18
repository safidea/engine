import type { ConfigError } from '@domain/entities/error/Config'
import type { State } from '../../State'

export type ReactComponent<T> = (props: T) => JSX.Element

export interface BaseProps {
  key?: string | number
  className?: string
}

export interface Base<P extends BaseProps> {
  init: () => Promise<void>
  render: (state: State) => Promise<(props?: Partial<P>) => JSX.Element>
  validateConfig: () => ConfigError[]
}
