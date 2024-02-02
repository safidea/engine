export interface ScriptConfig {
  src: string
  type?: 'module' | 'text/javascript'
}

export class Script {
  src: string
  type: 'module' | 'text/javascript'

  constructor(config: ScriptConfig) {
    this.src = config.src
    this.type = config.type || 'text/javascript'
  }

  render = () => {
    return <script src={this.src} type={this.type} />
  }
}
