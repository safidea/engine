import * as t from 'io-ts'

export const GroupBy = t.type({
  field: t.string,
  order: t.union([
    t.literal('asc'),
    t.literal('desc'),
    t.literal('first_to_last'),
    t.literal('last_to_first'),
  ]),
})

export type GroupBy = t.TypeOf<typeof GroupBy>

export const SortBy = t.type({
  field: t.string,
  order: t.union([
    t.literal('asc'),
    t.literal('desc'),
    t.literal('first_to_last'),
    t.literal('last_to_first'),
  ]),
})

export type SortBy = t.TypeOf<typeof SortBy>

export const Column = t.intersection([
  t.type({
    label: t.string,
  }),
  t.partial({
    field: t.string,
    options: t.array(
      t.type({
        name: t.string,
        label: t.string,
      })
    ),
    type: t.string,
    action: t.partial({
      type: t.string,
      path: t.string,
      url: t.string,
    }),
    buttonLabel: t.string,
  }),
])

export type Column = t.TypeOf<typeof Column>

export const ListComponentParams = t.intersection([
  t.type({
    type: t.literal('list'),
    table: t.string,
    columns: t.array(Column),
  }),
  t.partial({
    groupBy: t.array(GroupBy),
    sortBy: t.array(SortBy),
  }),
])

export type ListComponentParams = t.TypeOf<typeof ListComponentParams>
