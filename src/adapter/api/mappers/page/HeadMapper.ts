import { Head } from '@domain/entities/page/head'
import type { Head as HeadConfig } from '../../configs/page/head'
import { Meta } from '@domain/entities/page/head/Meta'
import { Link } from '@domain/entities/page/head/Link'
import { Script } from '@domain/entities/page/head/Script'

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
    const indexJs = new Script({ src: '/index.js', timestamp })
    const scripts = [
      indexJs,
      ...scriptsConfigs.map((script) => new Script({ ...script, timestamp })),
    ]
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
