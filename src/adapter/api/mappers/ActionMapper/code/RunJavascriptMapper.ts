import type { RunJavascript as Config } from '@adapter/api/configs/Action/code/RunJavascript'
import { RunJavascript, type Services } from '@domain/entities/Action/code/RunJavascript'

export type RunJavascriptServices = Services

export class RunJavascriptMapper {
  static toEntity = (config: Config, services: Services): RunJavascript => {
    return new RunJavascript(config, services)
  }
}
