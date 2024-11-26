import type {
  ICodeRunnerSpi,
  CodeRunnerContextServices,
  CodeRunnerContextIntegrations,
} from '@domain/services/CodeRunner'

export interface ICodeRunnerDriver {
  run: (
    data: object,
    services: CodeRunnerContextServices,
    integrations: CodeRunnerContextIntegrations
  ) => Promise<object>
}

export class CodeRunnerSpi implements ICodeRunnerSpi {
  constructor(private _driver: ICodeRunnerDriver) {}

  run = (
    data: object,
    services: CodeRunnerContextServices,
    integrations: CodeRunnerContextIntegrations
  ) => {
    return this._driver.run(data, services, integrations)
  }
}
