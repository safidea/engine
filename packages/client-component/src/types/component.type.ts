/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HeroProps } from '../components/hero'
import type { TableProps } from '../components/table'
import type { ListProps } from '../components/list'

export type ComponentProps = HeroProps | TableProps | ListProps

export type ComponentType = React.FC<ComponentProps>

// TODO: remove any cases
export type CustomComponents = {
  [key: string]: React.FC<any>
  Image: React.FC<any>
  Link: React.FC<any>
}
