import * as t from 'io-ts'

export type BucketParams = {
  readonly name: string
}

export const BucketParams: t.Type<BucketParams> = t.type({
  name: t.string,
})
