interface Params {
  href: string
  rel?: string
  type?: string
  timestamp: number
}

export class Link {
  constructor(private _params: Params) {}

  get href() {
    const { href, timestamp } = this._params
    return href.includes('?') ? `${href}&t=${timestamp}` : `${href}?t=${timestamp}`
  }

  get type() {
    return this._params.type || 'text/css'
  }

  get rel() {
    return this._params.rel || 'stylesheet'
  }

  render = () => {
    return <link rel={this.rel} href={this.href} type={this.type} />
  }
}
