import type { AppError } from './app/AppError'
import type { ComponentError } from './component/ComponentError'
import type { FeatureError } from './feature/FeatureError'
import type { RoleError } from './role/RoleError'
import type { SpecError } from './spec/SpecError'

export type ConfigError = AppError | FeatureError | SpecError | RoleError | ComponentError
