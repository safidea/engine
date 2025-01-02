import App from '@latechforce/engine'
import { drivers } from '@latechforce/engine/node'

export type { Config } from '@latechforce/engine'

export default class NodeApp extends App {
  constructor() {
    super({ drivers })
  }
}
