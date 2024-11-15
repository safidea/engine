import type { IMeta } from '@adapter/api/configs/Head/Meta'
import type { ReactComponents } from '@domain/entities/Component'
import { HeadMeta } from '@domain/entities/Head/Meta'
import type {
  ClientActionProps,
  ClientFrameProps,
  IClientSpi,
  ClientStreamProps,
  ClientStreamSourceProps,
} from '@domain/services/Client'

export interface IClientDriver {
  metas: IMeta[]
  components: ReactComponents
  Frame: (props: ClientFrameProps) => JSX.Element
  Stream: (props: ClientStreamProps) => JSX.Element
  StreamSource: (props: ClientStreamSourceProps) => JSX.Element
  getActionProps: (options?: ClientActionProps) => { [key: string]: string }
  render: (component: JSX.Element) => string
}

export class ClientSpi implements IClientSpi {
  constructor(private _driver: IClientDriver) {}

  get metas() {
    return this._driver.metas.map((meta) => new HeadMeta(meta))
  }

  get components() {
    return this._driver.components
  }

  Frame = (props: ClientFrameProps) => this._driver.Frame(props)

  Stream = (props: ClientStreamProps) => this._driver.Stream(props)

  StreamSource = (props: ClientStreamSourceProps) => this._driver.StreamSource(props)

  getActionProps = (options?: ClientActionProps) => this._driver.getActionProps(options)

  render = (component: JSX.Element) => this._driver.render(component)
}
