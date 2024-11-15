import type { GetCompanyPappersActionConfig } from '@domain/entities/Action/pappers/GetCompany'

export interface IGetCompanyPappersAction extends GetCompanyPappersActionConfig {
  integration: 'Pappers'
  action: 'GetCompany'
}
