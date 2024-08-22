import type { Spi } from '@domain/services/React'

export interface Driver {
  render: (component: JSX.Element) => string
}

export class ReactSpi implements Spi {
  constructor(private _driver: Driver) {}

  render = (component: JSX.Element) => this._driver.render(component)
}
