import type { Link } from './Link'
import type { Meta } from './Meta'
import type { Script } from './Script'

export interface Head {
  title: string
  metas: Meta[]
  links: Link[]
  scripts: Script[]
}
