import type { Spi } from '@domain/services/Ui'

export interface Driver {
  render: (component: JSX.Element) => string
}

export class UiSpi implements Spi {
  constructor(private _driver: Driver) {}

  render = (component: JSX.Element) => this._driver.render(component)
}
