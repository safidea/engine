export interface Params {
  entity: string
  name: string
  message: string
}

export class ConfigError {
  public message: string
  public entity: string
  public name: string

  constructor(params: Params) {
    this.message = params.message
    this.entity = params.entity
    this.name = params.name
  }
}
