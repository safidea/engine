import { App, AppServices } from '@entities/app/App'
import { AppParams } from '@entities/app/AppParams'
import { PathReporter } from 'io-ts/PathReporter'
import { isLeft } from 'fp-ts/Either'

export class AppValidator {
  constructor(private services: AppServices) {}

  configuration(config: unknown): App {
    const decoded = AppParams.decode(config)
    if (isLeft(decoded)) {
      throw Error(`Could not validate data: ${PathReporter.report(decoded).join('\n')}`)
    }
    const appParams: AppParams = decoded.right
    return new App(appParams, this.services)
  }
}
