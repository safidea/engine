import type { Meta as MetaConfig } from '@adapter/api/configs/page/head/Meta'
import { Meta } from '@domain/engine/page/head/Meta'
import type { FrameProps, Spi } from '@domain/services/Ui'

export interface Driver {
  metas: MetaConfig[]
  render: (component: JSX.Element) => string
  Frame: (props: FrameProps) => JSX.Element
}

export class UiSpi implements Spi {
  constructor(private driver: Driver) {}

  get metas() {
    return this.driver.metas.map((meta) => new Meta(meta))
  }

  render = (component: JSX.Element) => this.driver.render(component)

  Frame = (props: FrameProps) => this.driver.Frame(props)
}
