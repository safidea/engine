import type { Drivers } from '@domain/drivers'

export interface ISpecParamsShared {
  drivers: Drivers
}

export interface ISpecParams extends ISpecParamsShared {
  featureName: string
}
