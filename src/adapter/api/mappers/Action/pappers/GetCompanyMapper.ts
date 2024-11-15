import {
  GetCompanyPappersAction,
  type GetCompanyPappersActionConfig,
  type GetCompanyPappersActionServices,
  type GetCompanyPappersActionIntegrations,
} from '@domain/entities/Action/pappers/GetCompany'

export type GetCompanyPappersActionMapperServices = GetCompanyPappersActionServices

export type GetCompanyPappersActionMapperIntegrations = GetCompanyPappersActionIntegrations

export class GetCompanyPappersActionMapper {
  static toEntity = (
    config: GetCompanyPappersActionConfig,
    services: GetCompanyPappersActionMapperServices,
    integrations: GetCompanyPappersActionIntegrations
  ): GetCompanyPappersAction => {
    return new GetCompanyPappersAction(config, services, integrations)
  }
}
