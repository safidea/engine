export interface LinkConfig {
  href: string
}

export class Link {
  href: string

  constructor(config: LinkConfig) {
    this.href = config.href
  }
}
