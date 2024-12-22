import type { ILink } from './Link'
import type { IMeta } from './Meta'
import type { IScript } from './Script'

export interface IHead {
  title?: string
  metas?: IMeta[]
  links?: ILink[]
  scripts?: IScript[]
}
