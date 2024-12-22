import {
  RunTypescriptCodeAction,
  type RunTypescriptCodeActionConfig,
  type RunTypescriptCodeActionServices,
} from '@domain/entities/Action/code/RunTypescript'

export type RunTypescriptCodeActionMapperServices = RunTypescriptCodeActionServices

export class RunTypescriptCodeActionMapper {
  static toEntity = (
    config: RunTypescriptCodeActionConfig,
    services: RunTypescriptCodeActionMapperServices
  ): RunTypescriptCodeAction => {
    return new RunTypescriptCodeAction(config, services)
  }
}
