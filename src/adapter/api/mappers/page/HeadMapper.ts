import { Head } from '@domain/entities/page/Head'
import type { Head as HeadConfig } from '../../configs/page/Head'
import { Meta } from '@domain/entities/page/Head/Meta'
import { Link } from '@domain/entities/page/Head/Link'
import { Script } from '@domain/entities/page/Head/Script'

export class HeadMapper {
  static toEntity(config: HeadConfig) {
    const Metas = config.metas.map((meta) => new Meta(meta))
    const Links = config.links.map((link) => new Link(link))
    const Scripts = config.scripts.map((script) => new Script(script))
    return new Head({
      title: config.title,
      metas: Metas,
      links: Links,
      scripts: Scripts,
    })
  }
}
