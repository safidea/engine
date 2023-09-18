import { AppServices } from '@entities/app/App'
import { PathReporter } from 'io-ts/PathReporter'
import { isLeft } from 'fp-ts/Either'
import { AppDto } from '@adapters/dtos/AppDto'
import { AppParams } from '@entities/app/AppParams'

export class AppValidator {
  constructor(private services: AppServices) {}

  validateConfig(config: unknown): AppParams {
    const decoded = AppDto.decode(config)
    if (isLeft(decoded)) {
      throw Error(`Could not validate config: ${PathReporter.report(decoded).join('\n')}`)
    }
    const appParams: AppParams = decoded.right
    return appParams
  }
}
