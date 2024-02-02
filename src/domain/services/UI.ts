export interface UiSpi {
  render: (component: JSX.Element) => string
}

export class Ui {
  constructor(private spi: UiSpi) {}

  render = (component: JSX.Element): string => {
    const html = this.spi.render(component)
    return html.replace(/<!--.*?-->/gs, '')
  }
}
