import * as t from 'io-ts'
import { ComponentParams } from './component/ComponentParams'

export type PageParams = {
  readonly path: string
  readonly components: ComponentParams[]
  readonly title: string
}

export const PageParams: t.Type<PageParams> = t.type({
  path: t.string,
  components: t.array(ComponentParams),
  title: t.string,
})
