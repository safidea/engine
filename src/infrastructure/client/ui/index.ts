import type { Client } from '@infrastructure/drivers/UiDriver'
import Frame from './Frame'
import Stream from './Stream'
import StreamSource from './StreamSource'
import { metas } from './metas'

export const client: Client = {
  metas,
  Frame,
  Stream,
  StreamSource,
}
