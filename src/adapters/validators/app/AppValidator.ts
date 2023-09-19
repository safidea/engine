import { isLeft } from 'fp-ts/Either'
import { AppDto } from '@adapters/dtos/AppDto'
import { AppParams } from '@entities/app/AppParams'
import reporter from 'io-ts-reporters'

export class AppValidator {
  static validateConfig(config: unknown): AppParams {
    const decoded = AppDto.decode(config)
    if (isLeft(decoded)) {
      throw Error(`Could not validate config:\n${reporter.report(decoded).join('\n')}`)
    }
    const appParams: AppParams = decoded.right
    return appParams
  }
}
