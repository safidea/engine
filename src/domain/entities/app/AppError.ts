export { AppNameRequiredError } from './errors/AppNameRequiredError'
export { AppFeaturesRequiredError } from './errors/AppFeaturesRequiredError'
export { AppRolesRequiredError } from './errors/AppRolesRequiredError'
export { AppUnknownPropertyError } from './errors/AppUnknownPropertyError'

import type { AppFeaturesRequiredError } from './errors/AppFeaturesRequiredError'
import type { AppNameRequiredError } from './errors/AppNameRequiredError'
import type { AppRolesRequiredError } from './errors/AppRolesRequiredError'
import type { AppUnknownPropertyError } from './errors/AppUnknownPropertyError'

export type AppError =
  | AppNameRequiredError
  | AppFeaturesRequiredError
  | AppRolesRequiredError
  | AppUnknownPropertyError
