import { PageApi } from '@adapter/api/PageApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/page/PageError'
export type { PageDto as PageConfig } from '@adapter/api/dtos/PageDto'
export default new PageApi(drivers, components)
