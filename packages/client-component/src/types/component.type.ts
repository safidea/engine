/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HeroProps } from '../components/Hero'
import type { TableProps } from '../components/Table'
import type { ListProps } from '../components/List'

export type ComponentProps = HeroProps | TableProps | ListProps

export type ComponentType = React.FC<ComponentProps>

// TODO: remove any cases
export type CustomComponents = {
  [key: string]: React.FC<any>
  Image: React.FC<any>
  Link: React.FC<any>
}
