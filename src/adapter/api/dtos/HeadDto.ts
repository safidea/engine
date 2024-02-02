import type { LinkConfig } from '@domain/entities/page/Head/Link'
import type { MetaConfig } from '@domain/entities/page/Head/Meta'
import type { ScriptConfig } from '@domain/entities/page/Head/Script'

export interface HeadDto {
  title: string
  metas: MetaConfig[]
  links: LinkConfig[]
  scripts: ScriptConfig[]
}
