import type { Meta } from '@domain/entities/Head/Meta'
import type { Link } from '@domain/entities/Head/Link'
import type { Script } from '@domain/entities/Head/Script'

interface Params {
  title?: string
  timestamp: number
  metas: Meta[]
  links: Link[]
  scripts: Script[]
}

export class Head {
  constructor(private params: Params) {}

  render = () => {
    const { title, metas, links, scripts } = this.params
    const tags = []
    if (title) tags.push(<title key="title">{title}</title>)
    tags.push(...metas.map((meta) => <meta.render key={meta.name} />))
    tags.push(...links.map((link) => <link.render key={link.href} />))
    tags.push(...scripts.map((script) => <script.render key={script.src} />))
    return tags
  }
}
