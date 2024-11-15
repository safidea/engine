import type { HeadMeta } from '@domain/entities/Head/Meta'
import type { HeadLink } from '@domain/entities/Head/Link'
import type { HeadScript } from '@domain/entities/Head/Script'

interface Params {
  title?: string
  timestamp: number
  metas: HeadMeta[]
  links: HeadLink[]
  scripts: HeadScript[]
}

export class Head {
  constructor(private _params: Params) {}

  render = () => {
    const { title, metas, links, scripts } = this._params
    const tags = []
    if (title) tags.push(<title key="title">{title}</title>)
    tags.push(...metas.map((meta) => <meta.render key={meta.name} />))
    tags.push(...links.map((link) => <link.render key={link.href} />))
    tags.push(...scripts.map((script) => <script.render key={script.src} />))
    return tags
  }
}
