import type { BaseComponent, Base } from '../base'

export interface LogosProps {
  title: string
  logos: {
    src: string
    alt: string
  }[]
}

export type LogosConfig = LogosProps

export interface LogosParams {
  component: BaseComponent<LogosProps>
}

export class Logos implements Base {
  constructor(
    private config: LogosProps,
    private params: LogosParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
