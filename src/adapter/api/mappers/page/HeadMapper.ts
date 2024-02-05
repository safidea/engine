import { Head } from '@domain/entities/page/Head'
import type { Head as HeadConfig } from '../../configs/page/Head'
import { Meta } from '@domain/entities/page/Head/Meta'
import { Link } from '@domain/entities/page/Head/Link'
import { Script } from '@domain/entities/page/Head/Script'

export class HeadMapper {
  static toEntity(config: HeadConfig) {
    const {
      title,
      metas: metasConfigs = [],
      links: linksConfigs = [],
      scripts: scriptsConfigs = [],
    } = config
    const timestamp = +new Date()
    const metas = metasConfigs.map((meta) => new Meta(meta))
    const scripts = scriptsConfigs.map((script) => new Script({ ...script, timestamp }))
    const outputCss = new Link({ href: '/output.css', timestamp })
    const links = [outputCss, ...linksConfigs.map((link) => new Link({ ...link, timestamp }))]
    return new Head({
      title,
      timestamp,
      metas,
      links,
      scripts,
    })
  }
}
