import type { Meta as MetaConfig } from '@adapter/api/configs/page/head/Meta'
import { Meta } from '@domain/engine/page/head/Meta'
import type { ActionProps, FrameProps, Spi, StreamProps, StreamSourceProps } from '@domain/services/Client'

export interface Driver {
  metas: MetaConfig[]
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getActionProps: (options?: ActionProps) => { [key: string]: string }
}

export class ClientSpi implements Spi {
  constructor(private driver: Driver) {}

  get metas() {
    return this.driver.metas.map((meta) => new Meta(meta))
  }

  Frame = (props: FrameProps) => this.driver.Frame(props)

  Stream = (props: StreamProps) => this.driver.Stream(props)

  StreamSource = (props: StreamSourceProps) => this.driver.StreamSource(props)

  getActionProps = (options?: ActionProps) => this.driver.getActionProps(options)
}
