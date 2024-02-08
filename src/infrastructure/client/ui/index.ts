import type { Client } from '@infrastructure/drivers/UiDriver'
import HotwiredFrame from './Frame'

export const client: Client = {
  Frame: HotwiredFrame,
}
