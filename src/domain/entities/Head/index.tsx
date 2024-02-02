import type { Meta } from './Meta'
import type { Link } from './Link'
import type { Script } from './Script'

export type HeadConfig = {
  title: string
  metas: Meta[]
  links: Link[]
  scripts: Script[]
}

export class Head {
  constructor(private config: HeadConfig) {}

  render = () => [
    <title key="title">{this.config.title}</title>,
    ...this.config.metas.map((meta) => <meta.render key={meta.name} />),
    ...this.config.links.map((link) => <link.render key={link.href} />),
    ...this.config.scripts.map((script) => <script.render key={script.src} />),
  ]
}
