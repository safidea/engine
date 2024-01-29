import type { Drivers } from '@domain/drivers'
import type { IDatabaseInstance } from '@domain/drivers/IDatabase'

export interface ISpecParamsShared {
  drivers: Drivers
}

export interface ISpecParams extends ISpecParamsShared {
  featureName: string
  databaseInstance: IDatabaseInstance
}
