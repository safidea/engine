import * as t from 'io-ts'

export const BucketParams = t.type({
  name: t.string,
})

export type BucketParams = t.TypeOf<typeof BucketParams>
