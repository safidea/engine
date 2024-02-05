import type { Meta } from './Meta'
import type { Link } from './Link'
import type { Script } from './Script'

interface Params {
  title: string
  metas: Meta[]
  links: Link[]
  scripts: Script[]
}

export class Head {
  constructor(private params: Params) {}

  render = () => [
    <title key="title">{this.params.title}</title>,
    ...this.params.metas.map((meta) => <meta.render key={meta.name} />),
    ...this.params.links.map((link) => <link.render key={link.href} />),
    ...this.params.scripts.map((script) => <script.render key={script.src} />),
  ]
}
