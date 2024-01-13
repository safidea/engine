import * as t from 'io-ts'

export type BaseFieldFormat =
  | 'text'
  | 'number'
  | 'currency'
  | 'datetime'
  | 'boolean'
  | 'recordId'
  | 'recordsIds'

export const BaseFieldFormat: t.Type<BaseFieldFormat> = t.union([
  t.literal('text'),
  t.literal('number'),
  t.literal('currency'),
  t.literal('datetime'),
  t.literal('boolean'),
  t.literal('recordId'),
  t.literal('recordsIds'),
])

export type BaseFieldParams = {
  readonly type: string
  readonly name: string
  readonly optional?: boolean
  readonly format?: BaseFieldFormat
  readonly default?: string | number | boolean
  readonly permissions?: {
    readonly update?: boolean | { readonly formula: string }
  }
}

export const BaseFieldParams: t.Type<BaseFieldParams> = t.intersection([
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
