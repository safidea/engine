import type { Client } from '@infrastructure/drivers/ReactUiDriver'
import HotwiredFrame from './Frame'

export const client: Client = {
  Frame: HotwiredFrame,
}
