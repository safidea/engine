interface Params {
  rel?: string
  href: string
  type?: string
  timestamp: number
}

export class Link {
  constructor(private params: Params) {}

  get href() {
    const { href, timestamp } = this.params
    return href.includes('?') ? `${href}&t=${timestamp}` : `${href}?t=${timestamp}`
  }

  get type() {
    return this.params.type || 'text/css'
  }

  get rel() {
    return this.params.rel || 'stylesheet'
  }

  render = () => {
    return <link rel={this.rel} href={this.href} type={this.type} />
  }
}
