interface HeadScriptParams {
  src: string
  type?: 'module' | 'text/javascript'
  timestamp: number
}

export class HeadScript {
  constructor(private _params: HeadScriptParams) {}

  get src() {
    const { src, timestamp } = this._params
    return src.includes('?') ? `${src}&t=${timestamp}` : `${src}?t=${timestamp}`
  }

  render = () => {
    return <script src={this._params.src} type={this._params.type} />
  }
}
