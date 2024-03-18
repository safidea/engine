export interface Spi {
  render: (component: JSX.Element) => string
}

export class Ui {
  constructor(private spi: Spi) {}

  renderToHtml = (component: JSX.Element): string => {
    const html = this.spi.render(component)
    return html.replace(/<!--|--!?>/g, "")
  }
}
