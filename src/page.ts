import { PageAPI } from '@adapter/api/PageAPI'
import { drivers } from '@infrastructure/drivers'

export { PageError } from '@domain/entities/PageError'
export type { PageConfig } from '@domain/entities/Page'
export default new PageAPI(drivers)
