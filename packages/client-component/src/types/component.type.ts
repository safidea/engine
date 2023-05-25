import type { HeroProps } from '../components/sections/hero.section'
import type { TableProps } from '../components/lists/table.list'

export type ComponentType = React.FC<HeroProps | TableProps>
