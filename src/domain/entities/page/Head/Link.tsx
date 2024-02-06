interface Params {
  href: string
  timestamp: number
}

export class Link {
  constructor(private params: Params) {}

  get href() {
    const { href, timestamp } = this.params
    return href.includes('?') ? `${href}&t=${timestamp}` : `${href}?t=${timestamp}`
  }

  render = () => {
    return <link rel="stylesheet" href={this.href} />
  }
}
