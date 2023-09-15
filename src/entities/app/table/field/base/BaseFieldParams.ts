import * as t from 'io-ts'

export const BaseFieldFormat = t.union([
  t.literal('text'),
  t.literal('number'),
  t.literal('currency'),
  t.literal('datetime'),
  t.literal('boolean'),
  t.literal('recordId'),
  t.literal('recordsIds'),
])

export type BaseFieldFormat = t.TypeOf<typeof BaseFieldFormat>

export const BaseFieldParams = t.intersection([
  t.type({
    type: t.string,
    name: t.string,
  }),
  t.partial({
    optional: t.boolean,
    format: BaseFieldFormat,
    default: t.union([t.string, t.number, t.boolean]),
    permissions: t.partial({
      update: t.union([t.boolean, t.type({ formula: t.string })]),
    }),
  }),
])

export type BaseFieldParams = t.TypeOf<typeof BaseFieldParams>
