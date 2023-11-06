import * as t from 'io-ts'
import { BaseComponentParams } from '../base/BaseComponentParams'
import { UIStyle } from '@entities/services/ui/UIStyle'

export type GroupBy = {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export const GroupBy: t.Type<GroupBy> = t.type({
  field: t.string,
  order: t.union([
    t.literal('asc'),
    t.literal('desc'),
    t.literal('first_to_last'),
    t.literal('last_to_first'),
  ]),
})

export type SortBy = {
  field: string
  order: 'asc' | 'desc' | 'first_to_last' | 'last_to_first'
}

export const SortBy: t.Type<SortBy> = t.type({
  field: t.string,
  order: t.union([
    t.literal('asc'),
    t.literal('desc'),
    t.literal('first_to_last'),
    t.literal('last_to_first'),
  ]),
})

export type Column = {
  label: string
  field?: string
  options?: {
    name: string
    label: string
  }[]
  type?: string
  action?: {
    type?: string
    path?: string
    url?: string
  }
  buttonLabel?: string
}

export const Column: t.Type<Column> = t.intersection([
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

export interface ListComponentParams extends BaseComponentParams {
  readonly type: 'list'
  readonly table: string
  readonly columns: Column[]
  readonly groupBy?: GroupBy[]
  readonly sortBy?: SortBy[]
  readonly style?: {
    readonly container?: UIStyle

    
    readonly header?: UIStyle
    readonly headerColumn?: UIStyle
    readonly row?: UIStyle
    readonly rows?: UIStyle
    readonly group?: UIStyle
    readonly cell?: UIStyle
  }
}

export const ListComponentParams: t.Type<ListComponentParams> = t.intersection([
  BaseComponentParams,
  t.type({
    type: t.literal('list'),
    table: t.string,
    columns: t.array(Column),
  }),
  t.partial({
    groupBy: t.array(GroupBy),
    sortBy: t.array(SortBy),
    style: t.partial({
      container: UIStyle,
      header: UIStyle,
      headerColumn: UIStyle,
      row: UIStyle,
      rows: UIStyle,
      group: UIStyle,
      cell: UIStyle,
    }),
  }),
])
