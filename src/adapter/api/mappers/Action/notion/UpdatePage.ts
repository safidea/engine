import {
  UpdatePageNotionAction,
  type UpdatePageNotionActionConfig,
  type UpdatePageNotionActionServices,
  type UpdatePageNotionActionIntegrations,
} from '@domain/entities/Action/notion/UpdatePage'

export type UpdatePageNotionActionMapperServices = UpdatePageNotionActionServices

export type UpdatePageNotionActionMapperIntegrations = UpdatePageNotionActionIntegrations

export class UpdatePageNotionActionMapper {
  static toEntity = (
    config: UpdatePageNotionActionConfig,
    services: UpdatePageNotionActionMapperServices,
    integrations: UpdatePageNotionActionIntegrations
  ): UpdatePageNotionAction => {
    return new UpdatePageNotionAction(config, services, integrations)
  }
}
