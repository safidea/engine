import type { Meta, MetaConfig } from './Meta'
import type { Link, LinkConfig } from './Link'
import type { Script, ScriptConfig } from './Script'

export interface HeadProps {
  title: string
  metas: MetaConfig[]
  links: LinkConfig[]
  scripts: ScriptConfig[]
}

export type HeadConfig = {
  title: string
  metas: Meta[]
  links: Link[]
  scripts: Script[]
}

export interface HeadParams {
  component: (props: HeadProps) => JSX.Element
}

export class Head {
  constructor(
    private config: HeadConfig,
    private params: HeadParams
  ) {}

  render = ({ children }: { children: React.ReactNode }) => (
    <this.params.component {...this.config}>{children}</this.params.component>
  )
}
