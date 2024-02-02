import type { LinkConfig } from '@domain/entities/Head/Link'
import type { MetaConfig } from '@domain/entities/Head/Meta'
import type { ScriptConfig } from '@domain/entities/Head/Script'

export interface HeadDto {
  title: string
  metas: MetaConfig[]
  links: LinkConfig[]
  scripts: ScriptConfig[]
}
