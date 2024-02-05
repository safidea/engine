import { Head } from '@domain/entities/page/Head'
import type { Head as HeadConfig } from '../../configs/page/Head'
import { Meta } from '@domain/entities/page/Head/Meta'
import { Link } from '@domain/entities/page/Head/Link'
import { Script } from '@domain/entities/page/Head/Script'

export class HeadMapper {
  static toEntity(config: HeadConfig) {
    const timestamp = +new Date()
    const metas = config.metas.map((meta) => new Meta(meta))
    const scripts = config.scripts.map((script) => new Script({ ...script, timestamp }))
    const outputCss = new Link({ href: '/output.css', timestamp })
    const links = [outputCss, ...config.links.map((link) => new Link({ ...link, timestamp }))]
    return new Head({
      title: config.title,
      timestamp,
      metas,
      links,
      scripts,
    })
  }
}
