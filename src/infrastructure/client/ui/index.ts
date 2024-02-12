import type { Client } from '@infrastructure/drivers/UiDriver'
import HotwiredFrame from './Frame'
import { metas } from './metas'

export const client: Client = {
  metas,
  Frame: HotwiredFrame,
}
