interface Params {
  src: string
  type?: 'module' | 'text/javascript'
  timestamp: number
}

export class Script {
  constructor(private params: Params) {}

  get src() {
    const { src, timestamp } = this.params
    return src.includes('?') ? `${src}&t=${timestamp}` : `${src}?t=${timestamp}`
  }

  render = () => {
    return <script src={this.params.src} type={this.params.type} />
  }
}
