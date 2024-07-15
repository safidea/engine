export interface Params {
  message: string
}

export class ConfigError {
  public message: string

  constructor(params: Params) {
    this.message = params.message
  }
}
