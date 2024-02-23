export interface Params {
  message: string
}

export class ConfigError {
  constructor(private params: Params) {}

  get message() {
    return this.params.message
  }
}
