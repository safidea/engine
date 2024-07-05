import { Head } from '@domain/engine/page/head'
import type { Head as HeadConfig } from '../../configs/page/Head'
import { Meta } from '@domain/engine/page/head/Meta'
import { Link } from '@domain/engine/page/head/Link'
import { Script } from '@domain/engine/page/head/Script'
import type { Client } from '@domain/services/Client'
import type { Theme } from '@domain/services/Theme'

interface Params {
  client: Client
  theme: Theme
}

export class HeadMapper {
  static toEntity(config: HeadConfig, params: Params) {
    const { client, theme } = params
    const {
      title,
      metas: metasConfigs = [],
      links: linksConfigs = [],
      scripts: scriptsConfigs = [],
    } = config
    const timestamp = +new Date()
    const fonts = theme.fonts()
    if (fonts.length > 0) {
      fonts.forEach((font) => {
        linksConfigs.unshift({ href: `/fonts/${font}.css` })
      })
    }
    linksConfigs.unshift({ href: '/output.css' })
    scriptsConfigs.unshift({ src: '/index.js' })
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
