export { AppNameRequiredError } from './errors/AppNameRequiredError'
export { AppFeaturesRequiredError } from './errors/AppFeaturesRequiredError'
export { AppRolesRequiredError } from './errors/AppRolesRequiredError'
export { AppUnknownPropertyError } from './errors/AppUnknownPropertyError'
export { AppComponentsRequiredError } from './errors/AppComponentsRequiredError'
export { AppTranslationsRequiredError } from './errors/AppTranslationsRequiredError'

import type { AppFeaturesRequiredError } from './errors/AppFeaturesRequiredError'
import type { AppNameRequiredError } from './errors/AppNameRequiredError'
import type { AppRolesRequiredError } from './errors/AppRolesRequiredError'
import type { AppUnknownPropertyError } from './errors/AppUnknownPropertyError'
import type { AppComponentsRequiredError } from './errors/AppComponentsRequiredError'
import type { AppTranslationsRequiredError } from './errors/AppTranslationsRequiredError'

export type AppError =
  | AppNameRequiredError
  | AppFeaturesRequiredError
  | AppRolesRequiredError
  | AppUnknownPropertyError
  | AppComponentsRequiredError
  | AppTranslationsRequiredError
