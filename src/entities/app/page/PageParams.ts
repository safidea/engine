import * as t from 'io-ts'
import { ComponentParams } from './component/ComponentParams'

export type PageParams = {
  readonly path: string
  readonly title: string
  readonly components: ComponentParams[]
}

export const PageParams: t.Type<PageParams> = t.type({
  path: t.string,
  title: t.string,
  components: t.array(ComponentParams),
})
