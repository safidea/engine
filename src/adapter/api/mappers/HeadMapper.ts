import { Head } from '@domain/entities/Head'
import type { IHead } from '../configs/Head'
import { HeadMeta } from '@domain/entities/Head/Meta'
import { HeadLink } from '@domain/entities/Head/Link'
import { HeadScript } from '@domain/entities/Head/Script'
import type { Client } from '@domain/services/Client'

interface HeadMapperServices {
  client: Client
}

export class HeadMapper {
  static toEntity(config: IHead, services: HeadMapperServices) {
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
    const scripts = scriptsConfigs.map((script) => new HeadScript({ ...script, timestamp }))
    const links = linksConfigs.map((link) => new HeadLink({ ...link, timestamp }))
    const metas = metasConfigs.map((meta) => new HeadMeta(meta))
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
