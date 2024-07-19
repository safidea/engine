import type { ConfigError } from '@domain/entities/Error/Config'
import type { State } from '@domain/entities/Page/State'

export type ReactComponent<T> = (props: T) => JSX.Element

export interface BaseProps {
  id?: string
  key?: string | number
  className?: string
  'data-component'?: string
  // TODO: replace this infrastructure dependency by domain dependency
  'data-action'?: string
}

export interface Base<P extends BaseProps> {
  init: () => Promise<void>
  render: (state: State) => Promise<(props?: Partial<P>) => JSX.Element>
  validateConfig: () => ConfigError[]
}

export type Align = 'left' | 'center' | 'right'
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type RoundedSize = 'sm' | 'md' | 'lg' | 'xl'
export type SizeWithNone = 'none' | Size
export type Font = 'sans' | 'serif' | 'mono'

export type Breakpoint = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Padding =
  | '0'
  | 'px'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96'
export type Dimension = 'x' | 'y' | 't' | 'b' | 'l' | 'r'
