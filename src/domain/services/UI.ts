export interface UISPI {
  render: (component: JSX.Element) => string
}

export class UI {
  constructor(private spi: UISPI) {}

  render = (component: JSX.Element): string => {
    const html = this.spi.render(component)
    return html.replace(/<!--.*?-->/gs, '')
  }
}
