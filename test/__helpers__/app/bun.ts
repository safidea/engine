import App from '@latechforce/engine'
import { drivers, integrations } from '@latechforce/engine/bun'

export type { Config } from '@latechforce/engine'

export default class BunApp extends App {
  constructor() {
    super({ drivers, integrations: integrations.mocks })
  }
}
