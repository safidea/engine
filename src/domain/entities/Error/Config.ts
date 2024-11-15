export interface ConfigErrorParams {
  entity: 'Action' | 'Component' | 'Field' | 'Table' | 'Automation' | 'Page' | 'Trigger'
  name: string
  message: string
}

export class ConfigError extends Error {
  public message: string
  public entity: string
  public name: string

  constructor(params: ConfigErrorParams) {
    super(params.message)
    this.message = params.message
    this.entity = params.entity
    this.name = params.name
  }
}
