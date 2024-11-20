import {
  CreateClientQontoAction,
  type CreateClientQontoActionConfig,
  type CreateClientQontoActionServices,
  type CreateClientQontoActionIntegrations,
} from '@domain/entities/Action/qonto/CreateClient'

export type CreateClientQontoActionMapperServices = CreateClientQontoActionServices

export type CreateClientQontoActionMapperIntegrations = CreateClientQontoActionIntegrations

export class CreateClientQontoActionMapper {
  static toEntity = (
    config: CreateClientQontoActionConfig,
    services: CreateClientQontoActionMapperServices,
    integrations: CreateClientQontoActionIntegrations
  ): CreateClientQontoAction => {
    return new CreateClientQontoAction(config, services, integrations)
  }
}
