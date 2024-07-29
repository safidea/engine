export interface Spi {
  render: (component: JSX.Element) => string
}

export class Ui {
  constructor(private _spi: Spi) {}

  renderToHtml = (component: JSX.Element): string => {
    const html = this._spi.render(component)
    return html.replace(/<!--.*?-->/gs, '')
  }
}
