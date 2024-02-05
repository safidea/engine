interface Params {
  src: string
  type?: 'module' | 'text/javascript'
}

export class Script {
  constructor(private params: Params) {}

  render = () => {
    return <script src={this.params.src} type={this.params.type} />
  }

  get src() {
    return this.params.src
  }
}
