import type { Meta as MetaConfig } from '@adapter/api/configs/Head/Meta'
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
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getActionProps: (options?: ActionProps) => { [key: string]: string }
}

export class ClientSpi implements Spi {
  constructor(private _driver: Driver) {}

  get metas() {
    return this._driver.metas.map((meta) => new Meta(meta))
  }

  Frame = (props: FrameProps) => this._driver.Frame(props)

  Stream = (props: StreamProps) => this._driver.Stream(props)

  StreamSource = (props: StreamSourceProps) => this._driver.StreamSource(props)

  getActionProps = (options?: ActionProps) => this._driver.getActionProps(options)
}
