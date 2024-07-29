interface Params {
  src: string
  type?: 'module' | 'text/javascript'
  timestamp: number
}

export class Script {
  constructor(private _params: Params) {}

  get src() {
    const { src, timestamp } = this._params
    return src.includes('?') ? `${src}&t=${timestamp}` : `${src}?t=${timestamp}`
  }

  render = () => {
    return <script src={this._params.src} type={this._params.type} />
  }
}
