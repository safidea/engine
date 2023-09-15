import * as t from 'io-ts'
import { ComponentParams } from './component/ComponentParams'

export const PageParams = t.type({
  path: t.string,
  components: t.array(ComponentParams),
  title: t.string,
})

export type PageParams = t.TypeOf<typeof PageParams>
