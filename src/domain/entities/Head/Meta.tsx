interface Params {
  name: string
  content: string
}

export class Meta {
  constructor(private _params: Params) {}

  render = () => {
    return <meta name={this._params.name} content={this._params.content} />
  }

  get name() {
    return this._params.name
  }
}
