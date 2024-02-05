interface Params {
  name: string
  content: string
}

export class Meta {
  constructor(private params: Params) {}

  render = () => {
    return <meta name={this.params.name} content={this.params.content} />
  }

  get name() {
    return this.params.name
  }
}
