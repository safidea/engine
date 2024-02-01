export interface MetaConfig {
  name: string
  content: string
}

export class Meta {
  name: string
  content: string

  constructor(config: MetaConfig) {
    this.name = config.name
    this.content = config.content
  }
}
