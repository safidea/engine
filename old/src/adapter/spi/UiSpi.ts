import type { Spi } from '@domain/services/Ui'

export interface Driver {
  render: (component: JSX.Element) => string
}

export class UiSpi implements Spi {
  constructor(private driver: Driver) {}

  render = (component: JSX.Element) => this.driver.render(component)
}
