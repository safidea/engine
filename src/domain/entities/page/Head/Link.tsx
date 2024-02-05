interface Params {
  href: string
}

export class Link {
  constructor(private params: Params) {}

  render = () => {
    return <link href={this.params.href} />
  }

  get href() {
    return this.params.href
  }
}
