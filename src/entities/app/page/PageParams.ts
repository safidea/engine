import * as t from 'io-ts'
import { ComponentParams } from './component/ComponentParams'

export type PageParams = {
  readonly name: string
  readonly path: string
  readonly title: string
  readonly components: ComponentParams[]
}

export const PageParams: t.Type<PageParams> = t.type({
  name: t.string,
  path: t.string,
  title: t.string,
  components: t.array(ComponentParams),
})
