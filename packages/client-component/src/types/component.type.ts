import type { HeroProps } from '../components/hero'
import type { TableProps } from '../components/table'
import type { ListProps } from '../components/list'

export type ComponentProps = HeroProps | TableProps | ListProps

export type ComponentType = React.FC<ComponentProps>
