import type { Base, BaseComponent } from '../base'

export interface NotFoundProps {
  title: string
  description: string
  primaryButton: {
    label: string
    href: string
  }
}

export type NotFoundConfig = NotFoundProps

export interface NotFoundParams {
  component: BaseComponent<NotFoundProps>
}

export class NotFound implements Base {
  constructor(
    private config: NotFoundProps,
    private params: NotFoundParams
  ) {}

  render = () => <this.params.component {...this.config} />
}
