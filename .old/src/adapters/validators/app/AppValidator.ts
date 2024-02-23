// TODO: remove ts-ignore when fp-ts/Either will not break "bun run tsc" command

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { isLeft } from 'fp-ts/Either'
import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { AppParams } from '@entities/app/AppParams'
import reporter from 'io-ts-reporters'

export class AppValidator {
  static validateConfig(config: unknown): AppParams {
    const decoded = ConfigDto.decode(config)
    if (isLeft(decoded)) {
      throw Error(`Could not validate config:\n${reporter.report(decoded).join('\n')}`)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const appParams: AppParams = decoded.right
    return appParams
  }
}
