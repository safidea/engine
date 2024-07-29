import { Head } from '@domain/entities/Head'
import type { Head as HeadConfig } from '../configs/Head'
import { Meta } from '@domain/entities/Head/Meta'
import { Link } from '@domain/entities/Head/Link'
import { Script } from '@domain/entities/Head/Script'
import type { Client } from '@domain/services/Client'

interface Services {
  client: Client
}

export class HeadMapper {
  static toEntity(config: HeadConfig, services: Services) {
    const { client } = services
    const {
      title,
      metas: metasConfigs = [],
      links: linksConfigs = [],
      scripts: scriptsConfigs = [],
    } = config
    const timestamp = +new Date()
    linksConfigs.unshift({ href: '/output.css' })
    scriptsConfigs.unshift({ src: '/index.js', type: 'module' })
    const scripts = scriptsConfigs.map((script) => new Script({ ...script, timestamp }))
    const links = linksConfigs.map((link) => new Link({ ...link, timestamp }))
    const metas = metasConfigs.map((meta) => new Meta(meta))
    metas.push(...client.metas)
    return new Head({
      title,
      timestamp,
      metas,
      links,
      scripts,
    })
  }
}
