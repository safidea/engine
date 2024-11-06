import type { Meta as MetaConfig } from '@adapter/api/configs/Head/Meta'
import type { ReactComponents } from '@domain/entities/Component'
import { Meta } from '@domain/entities/Head/Meta'
import type {
  ActionProps,
  FrameProps,
  Spi,
  StreamProps,
  StreamSourceProps,
} from '@domain/services/Client'

export interface Driver {
  metas: MetaConfig[]
  components: ReactComponents
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getActionProps: (options?: ActionProps) => { [key: string]: string }
  render: (component: JSX.Element) => string
}

export class ClientSpi implements Spi {
  constructor(private _driver: Driver) {}

  get metas() {
    return this._driver.metas.map((meta) => new Meta(meta))
  }

  get components() {
    return this._driver.components
  }

  Frame = (props: FrameProps) => this._driver.Frame(props)

  Stream = (props: StreamProps) => this._driver.Stream(props)

  StreamSource = (props: StreamSourceProps) => this._driver.StreamSource(props)

  getActionProps = (options?: ActionProps) => this._driver.getActionProps(options)

  render = (component: JSX.Element) => this._driver.render(component)
}
