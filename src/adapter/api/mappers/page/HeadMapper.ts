import { Head } from '@domain/engine/page/head'
import type { Head as HeadConfig } from '../../configs/page/Head'
import { Meta } from '@domain/engine/page/head/Meta'
import { Link } from '@domain/engine/page/head/Link'
import { Script } from '@domain/engine/page/head/Script'
import type { Client } from '@domain/services/Client'

interface Params {
  client: Client
}

export class HeadMapper {
  static toEntity(config: HeadConfig, params: Params) {
    const { client } = params
    const {
      title,
      metas: metasConfigs = [],
      links: linksConfigs = [],
      scripts: scriptsConfigs = [],
    } = config
    const timestamp = +new Date()
    const metas = metasConfigs.map((meta) => new Meta(meta))
    metas.push(...client.metas)
    const indexJs = new Script({ src: '/index.js', timestamp })
    const outputCss = new Link({ href: '/output.css', timestamp })
    const scripts = [
      indexJs,
      ...scriptsConfigs.map((script) => new Script({ ...script, timestamp })),
    ]
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
