import type { RunTypescript as Config } from '@adapter/api/configs/Action/code/RunTypescript'
import { RunTypescript, type Services } from '@domain/entities/Action/code/RunTypescript'

export type RunTypescriptServices = Services

export class RunTypescriptMapper {
  static toEntity = (config: Config, services: Services): RunTypescript => {
    return new RunTypescript(config, services)
  }
}
