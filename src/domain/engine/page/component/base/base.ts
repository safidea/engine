import type { ConfigError } from '@domain/entities/error/Config'

export type ReactComponent<T> = (props: T) => JSX.Element

export interface BaseProps {
  key?: string | number
  className?: string
}

export interface Base<P extends BaseProps> {
  init: () => Promise<void>
  render: () => Promise<(props?: Partial<P>) => JSX.Element>
  validateConfig: () => ConfigError[]
}

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
